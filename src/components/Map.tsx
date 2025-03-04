import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import type { LngLatLike } from "mapbox-gl";
import type { FeatureCollection, Geometry } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API as string;
const INITIAL_CENTER: LngLatLike = [139.767, 35.6814];

const Map = () => {
  mapboxgl.accessToken = MAPBOX_TOKEN;

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState<number>(16);
  const [markerPosition, setMarkerPosition] =
    useState<[number, number]>(INITIAL_CENTER);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [isochroneLayer, setIsochroneLayer] = useState<string | null>(null);
  const [bboxLayer, setBboxLayer] = useState<string | null>(null);
  const [supermarketLayer, setSupermarketLayer] = useState<string | null>(null);
  const [bentoLayer, setBentoLayer] = useState<string | null>(null);
  const [convenienceStoreLayer, setConvenienceStoreLayer] = useState<
    string | null
  >(null);
  const [coffeeLayer, setCoffeeLayer] = useState<string | null>(null);
  const [pediatricLayer, setPediatricLayer] = useState<string | null>(null);
  const [kindergartenLayer, setKindergartenLayer] = useState<string | null>(
    null,
  );
  const [dryCleaningLayer, setDryCleaningLayer] = useState<string | null>(null);
  const [gymLayer, setGymLayer] = useState<string | null>(null);
  const [parkLayer, setParkLayer] = useState<string | null>(null);
  const [walkTime, setWalkTime] = useState<number>(10);
  const [poiCounts, setPoiCounts] = useState<{ [key: string]: number }>({});

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

      if (isochroneLayer) {
        if (mapRef.current.getLayer(isochroneLayer)) {
          mapRef.current.removeLayer(isochroneLayer);
        }
        if (mapRef.current.getSource(isochroneLayer)) {
          mapRef.current.removeSource(isochroneLayer);
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

      setIsochroneLayer(newLayerId);

      // bboxを計算して表示する
      const bbox = turf.bbox(data);
      if (bboxLayer) {
        if (mapRef.current.getLayer(bboxLayer)) {
          mapRef.current.removeLayer(bboxLayer);
        }
        if (mapRef.current.getSource(bboxLayer)) {
          mapRef.current.removeSource(bboxLayer);
        }
      }
      const newBboxLayerId = `bbox-layer`;
      if (mapRef.current.getLayer(newBboxLayerId)) {
        mapRef.current.removeLayer(newBboxLayerId);
      }
      if (mapRef.current.getSource(newBboxLayerId)) {
        mapRef.current.removeSource(newBboxLayerId);
      }
      mapRef.current.addSource(newBboxLayerId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [bbox[0], bbox[1]],
                [bbox[2], bbox[1]],
                [bbox[2], bbox[3]],
                [bbox[0], bbox[3]],
                [bbox[0], bbox[1]],
              ],
            ],
          },
          properties: {},
        },
      });

      mapRef.current.addLayer({
        id: newBboxLayerId,
        type: "line",
        source: newBboxLayerId,
        paint: {
          "line-color": "#f00",
          "line-width": 2,
        },
      });

      setBboxLayer(newBboxLayerId);

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

        if (category === "レストラン>カフェ") {
          if (coffeeLayer) {
            if (mapRef.current.getLayer(coffeeLayer)) {
              mapRef.current.removeLayer(coffeeLayer);
              mapRef.current.removeLayer(`${coffeeLayer}-label`);
            }
            if (mapRef.current.getSource(coffeeLayer)) {
              mapRef.current.removeSource(coffeeLayer);
            }
          }
          const newCoffeeLayerId = `coffee-layer`;
          if (mapRef.current.getLayer(newCoffeeLayerId)) {
            mapRef.current.removeLayer(newCoffeeLayerId);
            mapRef.current.removeLayer(`${newCoffeeLayerId}-label`);
          }
          if (mapRef.current.getSource(newCoffeeLayerId)) {
            mapRef.current.removeSource(newCoffeeLayerId);
          }
          mapRef.current.addSource(newCoffeeLayerId, {
            type: "geojson",
            data: categoryData,
          });

          mapRef.current.addLayer({
            id: newCoffeeLayerId,
            type: "circle",
            source: newCoffeeLayerId,
            paint: {
              "circle-color": "#00f",
              "circle-radius": 5,
            },
          });

          // POIのポインタに名前を表示
          mapRef.current.addLayer({
            id: `${newCoffeeLayerId}-label`,
            type: "symbol",
            source: newCoffeeLayerId,
            layout: {
              "text-field": ["get", "name"],
              "text-offset": [0, 1.5],
              "text-anchor": "top",
            },
          });

          setCoffeeLayer(newCoffeeLayerId);
        } else if (category === "医療>小児科") {
          if (pediatricLayer) {
            if (mapRef.current.getLayer(pediatricLayer)) {
              mapRef.current.removeLayer(pediatricLayer);
              mapRef.current.removeLayer(`${pediatricLayer}-label`);
            }
            if (mapRef.current.getSource(pediatricLayer)) {
              mapRef.current.removeSource(pediatricLayer);
            }
          }
          const newPediatricLayerId = `pediatric-layer`;
          if (mapRef.current.getLayer(newPediatricLayerId)) {
            mapRef.current.removeLayer(newPediatricLayerId);
            mapRef.current.removeLayer(`${newPediatricLayerId}-label`);
          }
          if (mapRef.current.getSource(newPediatricLayerId)) {
            mapRef.current.removeSource(newPediatricLayerId);
          }
          mapRef.current.addSource(newPediatricLayerId, {
            type: "geojson",
            data: categoryData,
          });

          mapRef.current.addLayer({
            id: newPediatricLayerId,
            type: "circle",
            source: newPediatricLayerId,
            paint: {
              "circle-color": "#f00",
              "circle-radius": 5,
            },
          });

          // POIのポインタに名前を表示
          mapRef.current.addLayer({
            id: `${newPediatricLayerId}-label`,
            type: "symbol",
            source: newPediatricLayerId,
            layout: {
              "text-field": ["get", "name"],
              "text-offset": [0, 1.5],
              "text-anchor": "top",
            },
          });

          setPediatricLayer(newPediatricLayerId);
        } else if (category === "生活>保育園") {
          if (kindergartenLayer) {
            if (mapRef.current.getLayer(kindergartenLayer)) {
              mapRef.current.removeLayer(kindergartenLayer);
              mapRef.current.removeLayer(`${kindergartenLayer}-label`);
            }
            if (mapRef.current.getSource(kindergartenLayer)) {
              mapRef.current.removeSource(kindergartenLayer);
            }
          }
          const newKindergartenLayerId = `kindergarten-layer`;
          if (mapRef.current.getLayer(newKindergartenLayerId)) {
            mapRef.current.removeLayer(newKindergartenLayerId);
            mapRef.current.removeLayer(`${newKindergartenLayerId}-label`);
          }
          if (mapRef.current.getSource(newKindergartenLayerId)) {
            mapRef.current.removeSource(newKindergartenLayerId);
          }
          mapRef.current.addSource(newKindergartenLayerId, {
            type: "geojson",
            data: categoryData,
          });

          mapRef.current.addLayer({
            id: newKindergartenLayerId,
            type: "circle",
            source: newKindergartenLayerId,
            paint: {
              "circle-color": "#ff0",
              "circle-radius": 5,
            },
          });

          // POIのポインタに名前を表示
          mapRef.current.addLayer({
            id: `${newKindergartenLayerId}-label`,
            type: "symbol",
            source: newKindergartenLayerId,
            layout: {
              "text-field": ["get", "name"],
              "text-offset": [0, 1.5],
              "text-anchor": "top",
            },
          });

          setKindergartenLayer(newKindergartenLayerId);
        } else if (category === "ショップ>コンビニ") {
          if (convenienceStoreLayer) {
            if (mapRef.current.getLayer(convenienceStoreLayer)) {
              mapRef.current.removeLayer(convenienceStoreLayer);
              mapRef.current.removeLayer(`${convenienceStoreLayer}-label`);
            }
            if (mapRef.current.getSource(convenienceStoreLayer)) {
              mapRef.current.removeSource(convenienceStoreLayer);
            }
          }
          const newConvenienceStoreLayerId = `convenience-store-layer`;
          if (mapRef.current.getLayer(newConvenienceStoreLayerId)) {
            mapRef.current.removeLayer(newConvenienceStoreLayerId);
            mapRef.current.removeLayer(`${newConvenienceStoreLayerId}-label`);
          }
          if (mapRef.current.getSource(newConvenienceStoreLayerId)) {
            mapRef.current.removeSource(newConvenienceStoreLayerId);
          }
          mapRef.current.addSource(newConvenienceStoreLayerId, {
            type: "geojson",
            data: categoryData,
          });

          mapRef.current.addLayer({
            id: newConvenienceStoreLayerId,
            type: "circle",
            source: newConvenienceStoreLayerId,
            paint: {
              "circle-color": "#ff0",
              "circle-radius": 5,
            },
          });

          // POIのポインタに名前を表示
          mapRef.current.addLayer({
            id: `${newConvenienceStoreLayerId}-label`,
            type: "symbol",
            source: newConvenienceStoreLayerId,
            layout: {
              "text-field": ["get", "name"],
              "text-offset": [0, 1.5],
              "text-anchor": "top",
            },
          });

          setConvenienceStoreLayer(newConvenienceStoreLayerId);
        } else if (category === "ショップ>スーパー") {
          if (supermarketLayer) {
            if (mapRef.current.getLayer(supermarketLayer)) {
              mapRef.current.removeLayer(supermarketLayer);
              mapRef.current.removeLayer(`${supermarketLayer}-label`);
            }
            if (mapRef.current.getSource(supermarketLayer)) {
              mapRef.current.removeSource(supermarketLayer);
            }
          }
          const newSupermarketLayerId = `supermarket-layer`;
          if (mapRef.current.getLayer(newSupermarketLayerId)) {
            mapRef.current.removeLayer(newSupermarketLayerId);
            mapRef.current.removeLayer(`${newSupermarketLayerId}-label`);
          }
          if (mapRef.current.getSource(newSupermarketLayerId)) {
            mapRef.current.removeSource(newSupermarketLayerId);
          }
          mapRef.current.addSource(newSupermarketLayerId, {
            type: "geojson",
            data: categoryData,
          });

          mapRef.current.addLayer({
            id: newSupermarketLayerId,
            type: "circle",
            source: newSupermarketLayerId,
            paint: {
              "circle-color": "#0f0",
              "circle-radius": 5,
            },
          });

          // POIのポインタに名前を表示
          mapRef.current.addLayer({
            id: `${newSupermarketLayerId}-label`,
            type: "symbol",
            source: newSupermarketLayerId,
            layout: {
              "text-field": ["get", "name"],
              "text-offset": [0, 1.5],
              "text-anchor": "top",
            },
          });

          setSupermarketLayer(newSupermarketLayerId);
        } else if (category === "レストラン>弁当") {
          if (bentoLayer) {
            if (mapRef.current.getLayer(bentoLayer)) {
              mapRef.current.removeLayer(bentoLayer);
              mapRef.current.removeLayer(`${bentoLayer}-label`);
            }
            if (mapRef.current.getSource(bentoLayer)) {
              mapRef.current.removeSource(bentoLayer);
            }
          }
          const newBentoLayerId = `bento-layer`;
          if (mapRef.current.getLayer(newBentoLayerId)) {
            mapRef.current.removeLayer(newBentoLayerId);
            mapRef.current.removeLayer(`${newBentoLayerId}-label`);
          }
          if (mapRef.current.getSource(newBentoLayerId)) {
            mapRef.current.removeSource(newBentoLayerId);
          }
          mapRef.current.addSource(newBentoLayerId, {
            type: "geojson",
            data: categoryData,
          });

          mapRef.current.addLayer({
            id: newBentoLayerId,
            type: "circle",
            source: newBentoLayerId,
            paint: {
              "circle-color": "#00f",
              "circle-radius": 5,
            },
          });

          // POIのポインタに名前を表示
          mapRef.current.addLayer({
            id: `${newBentoLayerId}-label`,
            type: "symbol",
            source: newBentoLayerId,
            layout: {
              "text-field": ["get", "name"],
              "text-offset": [0, 1.5],
              "text-anchor": "top",
            },
          });

          setBentoLayer(newBentoLayerId);
        } else if (category === "生活>ドライクリーニング") {
          if (dryCleaningLayer) {
            if (mapRef.current.getLayer(dryCleaningLayer)) {
              mapRef.current.removeLayer(dryCleaningLayer);
              mapRef.current.removeLayer(`${dryCleaningLayer}-label`);
            }
            if (mapRef.current.getSource(dryCleaningLayer)) {
              mapRef.current.removeSource(dryCleaningLayer);
            }
          }
          const newDryCleaningLayerId = `dry-cleaning-layer`;
          if (mapRef.current.getLayer(newDryCleaningLayerId)) {
            mapRef.current.removeLayer(newDryCleaningLayerId);
            mapRef.current.removeLayer(`${newDryCleaningLayerId}-label`);
          }
          if (mapRef.current.getSource(newDryCleaningLayerId)) {
            mapRef.current.removeSource(newDryCleaningLayerId);
          }
          mapRef.current.addSource(newDryCleaningLayerId, {
            type: "geojson",
            data: categoryData,
          });

          mapRef.current.addLayer({
            id: newDryCleaningLayerId,
            type: "circle",
            source: newDryCleaningLayerId,
            paint: {
              "circle-color": "#ff0",
              "circle-radius": 5,
            },
          });

          // POIのポインタに名前を表示
          mapRef.current.addLayer({
            id: `${newDryCleaningLayerId}-label`,
            type: "symbol",
            source: newDryCleaningLayerId,
            layout: {
              "text-field": ["get", "name"],
              "text-offset": [0, 1.5],
              "text-anchor": "top",
            },
          });

          setDryCleaningLayer(newDryCleaningLayerId);
        } else if (category === "レジャー>スポーツジム") {
          if (gymLayer) {
            if (mapRef.current.getLayer(gymLayer)) {
              mapRef.current.removeLayer(gymLayer);
              mapRef.current.removeLayer(`${gymLayer}-label`);
            }
            if (mapRef.current.getSource(gymLayer)) {
              mapRef.current.removeSource(gymLayer);
            }
          }
          const newGymLayerId = `gym-layer`;
          if (mapRef.current.getLayer(newGymLayerId)) {
            mapRef.current.removeLayer(newGymLayerId);
            mapRef.current.removeLayer(`${newGymLayerId}-label`);
          }
          if (mapRef.current.getSource(newGymLayerId)) {
            mapRef.current.removeSource(newGymLayerId);
          }
          mapRef.current.addSource(newGymLayerId, {
            type: "geojson",
            data: categoryData,
          });

          mapRef.current.addLayer({
            id: newGymLayerId,
            type: "circle",
            source: newGymLayerId,
            paint: {
              "circle-color": "#ff0",
              "circle-radius": 5,
            },
          });

          // POIのポインタに名前を表示
          mapRef.current.addLayer({
            id: `${newGymLayerId}-label`,
            type: "symbol",
            source: newGymLayerId,
            layout: {
              "text-field": ["get", "name"],
              "text-offset": [0, 1.5],
              "text-anchor": "top",
            },
          });

          setGymLayer(newGymLayerId);
        } else if (category === "レジャー>公園") {
          if (parkLayer) {
            if (mapRef.current.getLayer(parkLayer)) {
              mapRef.current.removeLayer(parkLayer);
              mapRef.current.removeLayer(`${parkLayer}-label`);
            }
            if (mapRef.current.getSource(parkLayer)) {
              mapRef.current.removeSource(parkLayer);
            }
          }
          const newParkLayerId = `park-layer`;
          if (mapRef.current.getLayer(newParkLayerId)) {
            mapRef.current.removeLayer(newParkLayerId);
            mapRef.current.removeLayer(`${newParkLayerId}-label`);
          }
          if (mapRef.current.getSource(newParkLayerId)) {
            mapRef.current.removeSource(newParkLayerId);
          }
          mapRef.current.addSource(newParkLayerId, {
            type: "geojson",
            data: categoryData,
          });

          mapRef.current.addLayer({
            id: newParkLayerId,
            type: "circle",
            source: newParkLayerId,
            paint: {
              "circle-color": "#ff0",
              "circle-radius": 5,
            },
          });

          // POIのポインタに名前を表示
          mapRef.current.addLayer({
            id: `${newParkLayerId}-label`,
            type: "symbol",
            source: newParkLayerId,
            layout: {
              "text-field": ["get", "name"],
              "text-offset": [0, 1.5],
              "text-anchor": "top",
            },
          });

          setParkLayer(newParkLayerId);
        }
      }

      setPoiCounts(newPoiCounts);
    } catch (error) {
      const err = error as Error;
      console.error("Isochrone API Error:", err);
    }
  };

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (!mapRef.current) return;
    mapRef.current.on("click", e => {
      console.log(e.lngLat.toString());
      markerRef.current?.remove();
      const marker = new mapboxgl.Marker()
        .setLngLat(e.lngLat)
        .setPopup(new mapboxgl.Popup().setText(`${e.lngLat.toString()}`))
        .addTo(mapRef.current!);

      marker.togglePopup();
      markerRef.current = marker;
      setMarkerPosition([e.lngLat.lng, e.lngLat.lat]);
    });
    void fetchIsochrone(e.lngLat.lng, e.lngLat.lat);
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on("click", handleMapClick);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", handleMapClick);
      }
    };
  }, []);

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: INITIAL_CENTER,
        zoom: 14,
      });

      markerRef.current?.remove();

      if (isochroneLayer) {
        mapRef.current.removeLayer(isochroneLayer);
        mapRef.current.removeSource(isochroneLayer);
        setIsochroneLayer(null);
      }

      if (bboxLayer) {
        mapRef.current.removeLayer(bboxLayer);
        mapRef.current.removeSource(bboxLayer);
        setBboxLayer(null);
      }

      if (coffeeLayer) {
        mapRef.current.removeLayer(coffeeLayer);
        mapRef.current.removeLayer(`${coffeeLayer}-label`);
        mapRef.current.removeSource(coffeeLayer);
        setCoffeeLayer(null);
      }

      if (pediatricLayer) {
        mapRef.current.removeLayer(pediatricLayer);
        mapRef.current.removeLayer(`${pediatricLayer}-label`);
        mapRef.current.removeSource(pediatricLayer);
        setPediatricLayer(null);
      }

      if (supermarketLayer) {
        mapRef.current.removeLayer(supermarketLayer);
        mapRef.current.removeLayer(`${supermarketLayer}-label`);
        mapRef.current.removeSource(supermarketLayer);
        setSupermarketLayer(null);
      }

      if (bentoLayer) {
        mapRef.current.removeLayer(bentoLayer);
        mapRef.current.removeLayer(`${bentoLayer}-label`);
        mapRef.current.removeSource(bentoLayer);
        setBentoLayer(null);
      }

      if (dryCleaningLayer) {
        mapRef.current.removeLayer(dryCleaningLayer);
        mapRef.current.removeLayer(`${dryCleaningLayer}-label`);
        mapRef.current.removeSource(dryCleaningLayer);
        setDryCleaningLayer(null);
      }

      if (gymLayer) {
        mapRef.current.removeLayer(gymLayer);
        mapRef.current.removeLayer(`${gymLayer}-label`);
        mapRef.current.removeSource(gymLayer);
        setGymLayer(null);
      }

      if (parkLayer) {
        mapRef.current.removeLayer(parkLayer);
        mapRef.current.removeLayer(`${parkLayer}-label`);
        mapRef.current.removeSource(parkLayer);
        setParkLayer(null);
      }

      if (kindergartenLayer) {
        mapRef.current.removeLayer(kindergartenLayer);
        mapRef.current.removeLayer(`${kindergartenLayer}-label`);
        mapRef.current.removeSource(kindergartenLayer);
        setKindergartenLayer(null);
      }

      if (convenienceStoreLayer) {
        mapRef.current.removeLayer(convenienceStoreLayer);
        mapRef.current.removeLayer(`${convenienceStoreLayer}-label`);
        mapRef.current.removeSource(convenienceStoreLayer);
        setConvenienceStoreLayer(null);
      }
    }
  };

  useEffect(() => {
    console.log(isochroneLayer);
  }, [isochroneLayer]);

  useEffect(() => {
    if (markerPosition && isochroneLayer) {
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
      <div className="mt-4">
        <h2>カテゴリーの説明</h2>
        <ul>
          <li>ショップ&gt;スーパー: スーパー</li>
          <li>レストラン&gt;弁当: 弁当屋</li>
          <li>ショップ&gt;コンビニ: コンビニエンスストア</li>
          <li>レストラン&gt;カフェ: カフェ</li>
          <li>医療&gt;小児科: 小児科</li>
          <li>生活&gt;保育園: 保育園</li>
          <li>生活&gt;ドライクリーニング: ドライクリーニング店</li>
          <li>レジャー&gt;スポーツジム: スポーツジム</li>
          <li>レジャー&gt;公園: 公園</li>
        </ul>
      </div>
    </>
  );
};

export default Map;
