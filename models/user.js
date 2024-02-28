import mongoose, { mongo } from "mongoose";
import Review from "./review";

const userSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: String,
  required: true,
});

const User = mongoose.model("User", userSchema);
export default User;
