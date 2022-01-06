const Vonage = require("@vonage/server-sdk");
const { whisp, yell } = require("./whisper");
const { keys } = require("../config/settings");

const vonage = new Vonage({
  apiKey: keys.vonage.apiKey,
  apiSecret: keys.vonage.apiSecret,
});

// prettier-ignore
module.exports = {
  sendSMS: async (req, res) => {
    try {
      const { phoneNumber } = req.body;

      const from = "Vonage APIs";
      const to = 216 + "+" + phoneNumber;
      const text = "thank you for choosing our service , Rent-A-Tool team";

      const responseData = await vonage.message.sendSms(from, to, text);

      if (responseData.messages[0]["status"] === "0") {
        whisp("Message sent successfully.");
        res.status(201).send("Message sent successfully.");
      } else {
        yell(`Message failed with error: ${responseData.messages[0]["error-text"]}`)
        res.status(404).send(`Message failed with error: ${responseData.messages[0]["error-text"]}`)
      }

    } catch (error) {
      yell(error)
      res.status(500).send(error)
    }
  },
};
