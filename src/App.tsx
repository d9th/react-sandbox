import "./index.css";
import { Nav } from "./components/Nav";
import Map from "./components/Map";

const App: React.FC = () => {
  return (
    <div className="App">
      <Nav>react sandbox</Nav>
      <Map />
    </div>
  );
};

export default App;
