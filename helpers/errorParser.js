module.exports = {
  simplifyError: (error) => {
    let simple_Error = {};

    // Handling "is already registered" error
    if (error.code === 11000) {
      // console.log(error);
      simple_Error["username"] = `That username is already registered.`;
    }

    // Handling FrontEnd User Error
    for (let key in error.errors) {
      simple_Error[key] = error["errors"][key]["message"];
    }

    // incorrect username
    if (error.message == "Incorrect username") {
      simple_Error.username = "That username is not registered";
    }
    // incorrect email
    if (error.message == "Incorrect email") {
      simple_Error.email = "That email is not registered";
    }

    // incorrect password
    if (error.message == "Incorrect password") {
      simple_Error.password = "That password is not correct";
    }

    console.log({ error: simple_Error });
    return { error: simple_Error };
  },
};
