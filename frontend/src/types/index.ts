export type SignalType = "3-way" | "4-way-type1" | "4-way-type2" | "5-way";

export interface SignalDuration {
  signalNumber: number;
  duration: number;
}

export interface SignalConfig {
  type: SignalType;
  signals: SignalDuration[];
}
