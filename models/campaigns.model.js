import mongoose, { Schema } from "mongoose";

const campaignSchema = new Schema({
  campaignName: {
    type: String,
    required: true,
  },
  recepients: {
    type: [String],
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  delivery: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
});

export const campaignModel = mongoose.model("Campaign", campaignSchema);
