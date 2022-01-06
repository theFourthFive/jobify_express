const { environment } = require("../config/settings");
const util = require("util");

module.exports = {
  whisp: function () {
    if (environment !== "production") {
      args = [ "✔️  ", ...arguments]
      process.stdout.write(util.format.apply(this, args) + '\n');
    }
  },
  gossip: function () {
    if (environment !== "production") {
      args = [ "✔️  ", ...arguments]
      process.stdout.write(util.format.apply(this, args) + '\n');
    }
  },
  yell: function () {
    if (environment !== "production") {
      args = [ "❌  ", ...arguments]
      process.stdout.write(util.format.apply(this, args) + '\n');
    }
  },
  ignore: function () {
    return null;
  },
};
