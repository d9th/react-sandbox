import { useRef, useState, useEffect, useReducer } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import type { LngLatLike } from "mapbox-gl";
import type { FeatureCollection, Geometry } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API as string;
const INITIAL_CENTER: LngLatLike = [139.767, 35.6814];

type LayerState = {
  isochroneLayer: string | null;
  supermarketLayer: string | null;
  bentoLayer: string | null;
  convenienceStoreLayer: string | null;
  coffeeLayer: string | null;
  pediatricLayer: string | null;
  kindergartenLayer: string | null;
  dryCleaningLayer: string | null;
  gymLayer: string | null;
  parkLayer: string | null;
};

type LayerAction =
  | { type: "SET_LAYER"; layerType: keyof LayerState; layerId: string }
  | { type: "REMOVE_LAYER"; layerType: keyof LayerState }
  | { type: "REMOVE_ALL_LAYERS" };

const layerReducer = (state: LayerState, action: LayerAction): LayerState => {
  switch (action.type) {
    case "SET_LAYER":
      return { ...state, [action.layerType]: action.layerId };
    case "REMOVE_LAYER":
      return { ...state, [action.layerType]: null };
    case "REMOVE_ALL_LAYERS":
      return {
        isochroneLayer: null,
        supermarketLayer: null,
        bentoLayer: null,
        convenienceStoreLayer: null,
        coffeeLayer: null,
        pediatricLayer: null,
        kindergartenLayer: null,
        dryCleaningLayer: null,
        gymLayer: null,
        parkLayer: null,
      };
    default:
      return state;
  }
};

const Map = () => {
  mapboxgl.accessToken = MAPBOX_TOKEN;

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState<number>(16);
  const [markerPosition, setMarkerPosition] =
    useState<[number, number]>(INITIAL_CENTER);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [walkTime, setWalkTime] = useState<number>(10);
  const [poiCounts, setPoiCounts] = useState<{ [key: string]: number }>({});
  const [layerState, dispatch] = useReducer(layerReducer, {
    isochroneLayer: null,
    supermarketLayer: null,
    bentoLayer: null,
    convenienceStoreLayer: null,
    coffeeLayer: null,
    pediatricLayer: null,
    kindergartenLayer: null,
    dryCleaningLayer: null,
    gymLayer: null,
    parkLayer: null,
  });

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: center,
        zoom: zoom,
      });

      mapRef.current.on("move", () => {
        const mapCenter = mapRef.current?.getCenter();
        const mapZoom = mapRef.current?.getZoom();
        if (mapCenter) {
          setCenter([mapCenter.lng, mapCenter.lat]);
        }
        setZoom(mapZoom!);
      });

      const navControl = new mapboxgl.NavigationControl();
      mapRef.current.addControl(navControl, "top-right");

      const fullscreenControl = new mapboxgl.FullscreenControl();
      mapRef.current.addControl(fullscreenControl, "top-left");

      mapRef.current.on("click", handleMapClick);
    }
    return () => {
      mapRef.current?.remove();
    };
  }, []);

  const fetchIsochrone = async (lng: number, lat: number) => {
    const url = `https://api.mapbox.com/isochrone/v1/mapbox/walking/${lng},${lat}?contours_minutes=${walkTime}&polygons=true&denoise=1&generalize=10&access_token=${MAPBOX_TOKEN}`;

    try {
      const response = await fetch(url);
      const data = (await response.json()) as FeatureCollection<Geometry>;

      if (!mapRef.current) return;

      if (layerState.isochroneLayer) {
        if (mapRef.current.getLayer(layerState.isochroneLayer)) {
          mapRef.current.removeLayer(layerState.isochroneLayer);
        }
        if (mapRef.current.getSource(layerState.isochroneLayer)) {
          mapRef.current.removeSource(layerState.isochroneLayer);
        }
      }
      const newLayerId = `isochrone-layer`;
      if (mapRef.current.getLayer(newLayerId)) {
        mapRef.current.removeLayer(newLayerId);
      }
      if (mapRef.current.getSource(newLayerId)) {
        mapRef.current.removeSource(newLayerId);
      }
      mapRef.current.addSource(newLayerId, {
        type: "geojson",
        data: data,
      });

      mapRef.current.addLayer({
        id: newLayerId,
        type: "fill",
        source: newLayerId,
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.4,
        },
      });

      dispatch({
        type: "SET_LAYER",
        layerType: "isochroneLayer",
        layerId: newLayerId,
      });

      const bbox = turf.bbox(data);

      const categories = [
        "ショップ>スーパー",
        "レストラン>弁当",
        "ショップ>コンビニ",
        "レストラン>カフェ",
        "医療>小児科",
        "生活>保育園",
        "生活>ドライクリーニング",
        "レジャー>スポーツジム",
        "レジャー>公園",
      ];
      const newPoiCounts: { [key: string]: number } = {};

      for (const category of categories) {
        const categoryUrl = `https://api.mapbox.com/search/searchbox/v1/category/${category}?bbox=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}&proximity=${lng},${lat}&limit=25&language=ja&access_token=${MAPBOX_TOKEN}`;
        console.log("Query is ", categoryUrl);
        const categoryResponse = await fetch(categoryUrl);
        const categoryData =
          (await categoryResponse.json()) as FeatureCollection<Geometry>;

        console.log(`${category} Data:`, categoryData);
        newPoiCounts[category] = categoryData.features.length;

        const layerType = category.split(">")[1] as keyof LayerState;
        const layerId = `${layerType}-layer`;

        if (mapRef.current.getLayer(layerId)) {
          mapRef.current.removeLayer(layerId);
        }
        if (mapRef.current.getSource(layerId)) {
          mapRef.current.removeSource(layerId);
        }

        mapRef.current.addSource(layerId, {
          type: "geojson",
          data: categoryData,
        });

        mapRef.current.addLayer({
          id: layerId,
          type: "circle",
          source: layerId,
          paint: {
            "circle-color": "#00f",
            "circle-radius": 5,
          },
        });

        dispatch({ type: "SET_LAYER", layerType, layerId });
      }

      setPoiCounts(newPoiCounts);
    } catch (error) {
      const err = error as Error;
      console.error("Isochrone API Error:", err);
    }
  };

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (!mapRef.current) return;
    console.log(e.lngLat.toString());
    markerRef.current?.remove();
    const marker = new mapboxgl.Marker()
      .setLngLat(e.lngLat)
      .setPopup(new mapboxgl.Popup().setText(`${e.lngLat.toString()}`))
      .addTo(mapRef.current);

    marker.togglePopup();
    markerRef.current = marker;
    setMarkerPosition([e.lngLat.lng, e.lngLat.lat]);

    // 既存のレイヤーを削除
    Object.keys(layerState).forEach(layerType => {
      const layerId = layerState[layerType as keyof LayerState];
      if (layerId) {
        if (mapRef.current?.getLayer(layerId)) {
          mapRef.current.removeLayer(layerId);
        }
        if (mapRef.current?.getSource(layerId)) {
          mapRef.current.removeSource(layerId);
        }
      }
    });

    dispatch({ type: "REMOVE_ALL_LAYERS" });

    void fetchIsochrone(e.lngLat.lng, e.lngLat.lat);
  };

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: INITIAL_CENTER,
        zoom: 14,
      });

      markerRef.current?.remove();

      Object.keys(layerState).forEach(layerType => {
        const layerId = layerState[layerType as keyof LayerState];
        if (layerId) {
          if (mapRef.current?.getLayer(layerId)) {
            mapRef.current.removeLayer(layerId);
          }
          if (mapRef.current?.getSource(layerId)) {
            mapRef.current.removeSource(layerId);
          }
        }
      });

      dispatch({ type: "REMOVE_ALL_LAYERS" });
    }
  };

  useEffect(() => {
    console.log(layerState.isochroneLayer);
  }, [layerState.isochroneLayer]);

  useEffect(() => {
    if (markerPosition && layerState.isochroneLayer) {
      void fetchIsochrone(markerPosition[0], markerPosition[1]);
    }
  }, [walkTime]);

  return (
    <>
      <div className="w-full h-[800px]" ref={mapContainerRef} />
      <div className="mt-4">
        <div>
          lng {center[0].toFixed(4)}, lat {center[1].toFixed(4)}, zoom{" "}
          {zoom.toFixed(2)}
        </div>
        <div>
          marker lng {markerPosition[0].toFixed(4)}, lat{" "}
          {markerPosition[1].toFixed(4)}
        </div>

        <label className="block mb-2">徒歩時間 (分): {walkTime}</label>
        <input
          type="range"
          min="1"
          max="30"
          value={walkTime}
          onChange={e => setWalkTime(Number(e.target.value))}
          className="range range-primary"
        />
      </div>
      <div className="mt-4">
        {Object.entries(poiCounts).map(([category, count]) => (
          <div key={category}>
            {category}: {count} 件
          </div>
        ))}
      </div>
      <button className="btn btn-ghost" onClick={handleReset}>
        Reset
      </button>
    </>
  );
};

export default Map;
