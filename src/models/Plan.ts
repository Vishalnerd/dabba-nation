import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  mealsPerDay: Number,
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.models.Plan ||
  mongoose.model("Plan", PlanSchema);
