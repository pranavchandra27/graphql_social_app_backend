import { model, Schema } from "mongoose";

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  password: String,
  email: String,
  createdAt: String,
});

export default model("User", userSchema);
