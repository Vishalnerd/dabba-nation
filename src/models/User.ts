import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
