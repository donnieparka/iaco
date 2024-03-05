import mongoose, { Model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
export default User;
