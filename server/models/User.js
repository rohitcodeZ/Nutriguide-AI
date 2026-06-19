const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  goal: { type: String, enum: ["weight_loss", "weight_gain", "muscle_gain", "maintenance"], default: "maintenance" },
  mode: { type: String, enum: ["veg", "non_veg"], default: "veg" },
  age: { type: Number, default: null },
  weight: { type: Number, default: null },
  height: { type: Number, default: null },
  state: { type: String, default: null },
  region: { type: String, default: null },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
