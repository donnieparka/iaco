import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.loggerFunc = async function (user, password) {
  const userToLog = await this.findOne({ user });
  if (userToLog && (await bcrypt.compare(password, this.password))) {
    return userToLog;
  }
};

const User = mongoose.model("User", userSchema);
export default User;
