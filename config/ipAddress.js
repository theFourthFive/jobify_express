// Source:
// https://stackoverflow.com/questions/10750303/how-can-i-get-the-local-ip-address-in-node-js/10756441#10756441
var os = require("os");

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
  for (var k2 in interfaces[k]) {
    var address = interfaces[k][k2];
    if (address.family === "IPv4" && !address.internal) {
      addresses.push(address.address);
    }
  }
}

module.exports = addresses[0];
