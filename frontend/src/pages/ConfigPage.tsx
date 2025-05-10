import React from "react";
import SignalForm from "../components/SignalForm";

interface Props {
  type: "3-way" | "4-way-type1" | "4-way-type2" | "5-way";
}

const ConfigPage: React.FC<Props> = ({ type }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{type} Configuration</h2>
      <SignalForm intersectionType={type} />
    </div>
  );
};

export default ConfigPage;
