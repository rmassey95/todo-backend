import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  displayName: { type: String, required: true, minLength: 3, trim: true },
  profileImg: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
