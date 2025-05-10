import mongoose from "mongoose"

const signalSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["3-way", "4-way-type1", "4-way-type2", "5-way"],
      required: true,
    },
    signals: [
      {
        signalNumber: Number,
        duration: Number,
      },
    ],
  },
  { timestamps: true }
);

export const Signal = mongoose.model("Signal", signalSchema);
