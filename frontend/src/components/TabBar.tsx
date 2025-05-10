import React from "react";

interface Props {
  current: number;
  setTab: (index: number) => void;
}

const tabs = ["3-Way", "4-Way Type 1", "4-Way Type 2", "5-Way", "Visualizer"];

const TabBar: React.FC<Props> = ({ current, setTab }) => (
  <div className="flex justify-around bg-white p-2 shadow">
    {" "}
    {tabs.map((tab, idx) => (
      <button
        key={idx}
        onClick={() => setTab(idx)}
        className={`px-4 py-2 rounded cursor-pointer ${
          idx === current ? "bg-green-600 text-white" : "bg-gray-200"
        }`}
      >
        {" "}
        {tab}{" "}
      </button>
    ))}{" "}
  </div>
);
export default TabBar;
