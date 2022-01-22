const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const bannedEventSchema = mongoose.Schema(
  {
    eventID: {
      type: Number,
      // required: [true, "Please enter an email"],
      // lowercase: true,
      // validate: [isEmail, "Please enter a valid email"],
    },
    eventInfo: {
      type: String,
    },
    editable: {
      type: String,
    },
  },
  { versionKey: false } // to not save the __v attribute ... // Source: https://mongoosejs.com/docs/guide.html#versionKey
);

module.exports = mongoose.model("BannedEvent", bannedEventSchema);
