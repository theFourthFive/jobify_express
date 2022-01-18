const { whisp } = require("./whisper");

// prettier-ignore
module.exports = {
  banWorker: (worker) => {

    // if we got a null response after doing .findOne()
    if (response === null) {

      // then we return null
      return null;

    } else {
      // if case the method .findAll() is called that returns an array of models
      if (response instanceof Array) {

        // we return an array containing only the data that we need to show to the user
        return response.map((element) => {

          // we go through the array of models, and delete only nullish attributes
          for (attribute in element.dataValues) {

            // if the attribute is null or undefined
            if ([null].includes(element.dataValues[attribute])) {

              // then I delete, the nullish attribute (except for the one which equal to "availibility")
              if(attribute !== "availibility") delete element.dataValues[attribute]
              // delete element.dataValues[attribute] // I commented this line, because I want to keep an eye on the "availability of the worker"
            }
            // and delete the hashed password of course ... I don't want to send it to the front-end
            delete element.dataValues.password;
          }
          // return only the valid data that I need to send to the front end
          return element.dataValues;
        })

      } else {
        // in case of the response that I get from the sequelize is not an array, after using for example .findOne()

        // we go through the attribute and only delete attribute that contains null value or undefined value
        for (attribute in response.dataValues) {

          // if the attribute is null or undefined
          if ([null, undefined].includes(response.dataValues[attribute])) {

            // then I delete, the nullish attribute (except for the one which equal to "availibility")
            if(attribute !== "availibility") delete response.dataValues[attribute]

            // delete response.dataValues[attribute] // I commented this line, because I want to keep an eye on the "availability of the worker"
          }
          // and delete the hashed password of course ... I don't want to send it to the front-end
          delete response.dataValues.password
        }

        // return only the valid data that I need to send to the front end
        return response.dataValues
      }
    }
  },
};
