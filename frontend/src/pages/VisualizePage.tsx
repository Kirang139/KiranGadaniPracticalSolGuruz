import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import type { SignalConfig } from "../types";
import "../index.css";
interface SignalStatus {
  signalNumber: number;
  isActive: boolean;
  color: "red" | "orange" | "green";
  remainingTime: number;
}

const VisualizePage: React.FC = () => {
  const [signalConfig, setSignalConfig] = useState<SignalConfig | null>(null);
  const [signals, setSignals] = useState<SignalStatus[]>([]);
  const currentIndex = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [allConfigs, setAllConfigs] = useState<SignalConfig[]>([]);
  const [selectedWays, setSelectedWays] = useState<string>(""); // default: none

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/signals")
      .then((res) => {
        const configs = res.data;
        if (!Array.isArray(configs) || configs.length === 0) {
          console.warn("No configs.");
          return;
        }
        setAllConfigs(configs);
      })
      .catch((err) => {
        console.error("Failed to fetch signals:", err);
      });
  }, []);

  useEffect(() => {
    if (!signalConfig) return;

    const initializeSignals = () => {
      if (!signalConfig || !signalConfig.signals) {
        console.warn("signalConfig or signalConfig.signals is undefined.");
        return;
      }

      const initialized = signalConfig.signals.map((s) => ({
        signalNumber: s.signalNumber,
        isActive: false,
        color: "red" as "red",
        remainingTime: 0,
      }));
      setSignals(initialized);
    };

    initializeSignals();
    startCycle();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [signalConfig]);

  useEffect(() => {
    if (selectedWays === "") return;

    const filtered = allConfigs
      .filter((conf) => conf.type === selectedWays)
      .pop(); // get latest

    if (filtered) {
      setSignalConfig(filtered);
    } else {
      setSignalConfig(null);
    }
  }, [selectedWays, allConfigs]);

  const startCycle = () => {
    if (
      !signalConfig ||
      !signalConfig.signals ||
      signalConfig.signals.length === 0
    ) {
      console.warn("No signal configuration.");
      return;
    }

    const total = signalConfig.signals.length;
    const cycle = () => {
      const index = currentIndex.current % total;
      const duration = signalConfig.signals[index].duration;

      setSignals((prev) =>
        prev.map((s, i) => {
          if (i === index) {
            return {
              ...s,
              isActive: true,
              color: "green",
              remainingTime: duration,
            };
          } else {
            return {
              ...s,
              isActive: false,
              color: "red",
              remainingTime: 0,
            };
          }
        })
      );

      let countdown = duration;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        countdown--;
        setSignals((prev) =>
          prev.map((s, i) => {
            if (i === index) {
              return {
                ...s,
                remainingTime: countdown,
                color:
                  countdown <= 3 && countdown > 0
                    ? "orange"
                    : countdown > 0
                    ? "green"
                    : "red",
              };
            }
            return s;
          })
        );

        if (countdown <= 0) {
          currentIndex.current = (currentIndex.current + 1) % total;
          clearInterval(intervalRef.current!);
          setTimeout(cycle, 1000);
        }
      }, 1000);
    };

    cycle();
  };

  const getLightClass = (
    signal: SignalStatus,
    color: "red" | "orange" | "green"
  ) => {
    const isOn = signal.color === color;
    const colorMap = {
      red: "bg-red-500",
      orange: "bg-orange-400",
      green: "bg-green-500",
    };

    return `w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
      isOn ? colorMap[color] : "bg-gray-300"
    }`;
  };

  const handleEmergency = (signalIndex: number) => {
    if (!signalConfig) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    currentIndex.current = signalIndex;

    const emergencyDuration = 30;
    let countdown = emergencyDuration;

    setSignals((prev) =>
      prev.map((s, i) => {
        if (i === signalIndex) {
          return {
            ...s,
            isActive: true,
            color: "green",
            remainingTime: emergencyDuration,
          };
        } else {
          return {
            ...s,
            isActive: false,
            color: "red",
            remainingTime: 0,
          };
        }
      })
    );

    intervalRef.current = setInterval(() => {
      countdown--;
      setSignals((prev) =>
        prev.map((s, i) => {
          if (i === signalIndex) {
            return {
              ...s,
              remainingTime: countdown,
              color:
                countdown <= 3 && countdown > 0
                  ? "orange"
                  : countdown > 0
                  ? "green"
                  : "red",
            };
          }
          return s;
        })
      );

      if (countdown <= 0) {
        clearInterval(intervalRef.current!);
        currentIndex.current = (signalIndex + 1) % signalConfig.signals.length;
        setTimeout(() => startCycle(), 1000);
      }
    }, 1000);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Visualize Traffic Signals</h1>
      <select
        value={selectedWays}
        onChange={(e) => setSelectedWays(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
      >
        <option value={""}>Select Ways</option>
        <option value={"3-way"}>3-Way</option>
        <option value={"4-way-type1"}>4-Way Type 1</option>
        <option value={"4-way-type2"}>4-Way Type 2</option>
        <option value={"5-way"}>5-Way</option>
      </select>

      {!signalConfig && <p>No configuration found...</p>}
      {signalConfig && (
        <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
          {signals.map((signal, index) => (
            <div
              key={signal.signalNumber}
              style={{ padding: "2% 0% 0% 0%" }}
              className="flex flex-col items-center border rounded shadow"
            >
              <div
                className="space-y-2 mb-2"
                style={{
                  backgroundColor: "black",
                  padding: "1rem",
                  borderRadius: "1rem",
                }}
              >
                <div className={getLightClass(signal, "red")}></div>
                <div className={getLightClass(signal, "orange")}></div>
                <div className={getLightClass(signal, "green")}></div>
              </div>
              <p className="text-sm">
                Signal {signal.signalNumber} -
                {signal.color === "green"
                  ? ` Open: ${signal.remainingTime}s`
                  : signal.color === "orange"
                  ? ` Switching: ${signal.remainingTime}s`
                  : ` Wait`}
              </p>

              <button
                onClick={() => handleEmergency(index)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs m-2"
              >
                Emergency
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisualizePage;
