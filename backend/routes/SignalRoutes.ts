import express from "express";
import { createSignal, getAllSignals } from "../controllers/SignalController";

const router = express.Router();

router.post("/signals", createSignal);
router.get("/signals", getAllSignals);

export default router;
