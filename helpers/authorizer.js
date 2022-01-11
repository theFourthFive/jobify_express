const { accesTokenSecret } = require("../config/settings").keys.jwt;
const jwt = require("jsonwebtoken");
const { whisp, ignore } = require("./whisper");

const maxAge = 60 * 60 * 24 * 3;
const newAccessToken = (_id, tokenLifeTime = 1) => {
  return jwt.sign({ _id }, accesTokenSecret, {
    // if tokenLifeTime is null or falsy value, we set the Token's expiricy for 1 second instead of 1 day
    expiresIn: parseInt(maxAge, 10) * (tokenLifeTime ? 1 : 0) + 1,
  });
};

// prettier-ignore
module.exports = {
  ping: (id, tokenLifeTime) => { // send a new jwt signed token to the user
    let accessToken = newAccessToken(id, tokenLifeTime);
    whisp(accessToken);
    return accessToken;
  },
  pong: () => {
    // receiving data from the user
    ignore();
  },
};
