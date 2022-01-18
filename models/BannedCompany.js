const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const bannedCompanySchema = mongoose.Schema(
  {
    email: {
      type: String,
      // required: [true, "Please enter an email"],
      lowercase: true,
      // validate: [isEmail, "Please enter a valid email"],
    },
    accountInfo: {
      type: String,
    },
  },
  { versionKey: false } // to not save the __v attribute ... // Source: https://mongoosejs.com/docs/guide.html#versionKey
);

module.exports = mongoose.model("BannedEvent", bannedCompanySchema);
