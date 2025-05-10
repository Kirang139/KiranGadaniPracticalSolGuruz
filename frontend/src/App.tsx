import { useState } from "react";
import TabBar from "./components/TabBar";
import ConfigPage from "./pages/ConfigPage";
import VisualizePage from "./pages/VisualizePage";
import './index.css'

function App() {
  const [tab, setTab] = useState(0);

  return (
    <div className="h-screen flex flex-col">
      <TabBar current={tab} setTab={setTab} />
      <div className="flex-1 overflow-auto bg-gray-50 p-4">
        {tab === 0 && <ConfigPage type="3-way" />}
        {tab === 1 && <ConfigPage type="4-way-type1" />}
        {tab === 2 && <ConfigPage type="4-way-type2" />}
        {tab === 3 && <ConfigPage type="5-way" />}
        {tab === 4 && <VisualizePage />}
      </div>
    </div>
  );
}

export default App;
