const { yell, ignore } = require("../helpers/whisper");
const { server } = require("../config/settings");

// prettier-ignore
module.exports = {
  wrongEndpoint_And_404Error_Catcher: (req, res, next) => {
    ignore(res);

    The_Wrong_Url_That_The_User_Entered = req.protocol + '://' + req.get('host') + req.originalUrl;
    const wrongEndpoint = new Error(`The Requested URL is not found: ${The_Wrong_Url_That_The_User_Entered}`);
    wrongEndpoint.status = 404;
    next(wrongEndpoint);
  },
  errorHandler: (wrongEndpoint, req, res, next) => {
    ignore(req, next);

    const error = server.environment === "development" ? wrongEndpoint : {};
    const status = wrongEndpoint.status || 500;

    // respond to client
    res.status(status).json({ error: { message: error.message } });
    // Respond to ourselves
    yell(wrongEndpoint);
  },
};
