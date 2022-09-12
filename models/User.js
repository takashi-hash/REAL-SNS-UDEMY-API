const mongoose = require("mongoose");

/*
 * User のスキーマを定義する
 */
const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 25,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 50,
    },
    profilePicture: {
      type: String,
      default: true,
    },
    coverPicture: {
      type: String,
      default: true,
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 70,
    },
    city: {
      type: String,
      max: 50,
    },
  },
  { timeseries: true }
);

module.exports = mongoose.model("User", UserSchema);