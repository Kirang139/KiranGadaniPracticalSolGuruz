import { Request, Response } from "express";
import { Signal } from "../models/Signal";

export const createSignal = async (req: Request, res: Response) => {
  try {
    const { type, signals } = req.body;
    const signalConfig = new Signal({ type, signals });
    await signalConfig.save();
    res.status(201).json(signalConfig);
  } catch (err) {
    res.status(500).json({ error: "Error in createSignal()" });
  }
};

export const getAllSignals = async (req: Request, res: Response) => {
  try {
    const configs = await Signal.find();
    res.json(configs);
  } catch (err) {
    res.status(500).json({ error: "Error in getAllSignals()" });
  }
};
