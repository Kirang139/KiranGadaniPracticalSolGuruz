import React, { useState, useEffect } from "react";
import type { SignalConfig, SignalType } from "../types";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  intersectionType: SignalType;
  onSave?: () => void;
}

const SignalForm: React.FC<Props> = ({ intersectionType, onSave }) => {
  const [durations, setDurations] = useState<number[]>([]);

  useEffect(() => {
    const signalCount = getSignalCount(intersectionType);
    setDurations(Array(signalCount).fill(0));
  }, [intersectionType]);

  const getSignalCount = (type: SignalType): number => {
    switch (type) {
      case "3-way":
        return 3;
      case "4-way-type1":
      case "4-way-type2":
        return 4;
      case "5-way":
        return 5;
      default:
        return 3;
    }
  };

  const handleDurationChange = (index: number, value: string) => {
    const updated = [...durations];
    const parsed = parseInt(value, 10);
    updated[index] = isNaN(parsed) ? 0 : parsed;
    setDurations(updated);
  };

  const handleSubmit = async () => {
    const data: SignalConfig = {
      type: intersectionType,
      signals: durations.map((duration, i) => ({
        signalNumber: i + 1,
        duration,
      })),
    };

    try {
      await axios.post("http://localhost:5000/api/signals", data);
      toast.success("Configuration saved successfully!");
      setDurations(Array(getSignalCount(intersectionType)).fill(0));
      onSave?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save configuration.");
    }
  };

  return (
    <>
      <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-sm mx-auto">
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
          Signal Timing Config
        </h2>

        <div className="space-y-3">
          {durations.map((ele, index) => (
            <div key={index} className="flex flex-col">
              <label
                htmlFor={`signal-${index}`}
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Signal {index + 1}
              </label>
              <input
                id={`signal-${index}`}
                type="number"
                value={durations[index]}
                onChange={(e) => handleDurationChange(index, e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Duration (sec)"
                min={0}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-5 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          Save
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default SignalForm;
