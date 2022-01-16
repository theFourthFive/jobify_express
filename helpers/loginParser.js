// prettier-ignore
module.exports = {
  loginParser: (username_or_email) => {

    let loginFilter = {};
    if (username_or_email.includes("@")) {
      loginFilter = { email: username_or_email };
    } else if(parseInt(username_or_email, 10).toString() === username_or_email){
      // if we parse "123x", we will obtain only 123, then we compare it with "123x"
      // if (123).toString() !== "123x"
      // that means the user provided his username & not his phone number
      loginFilter = { phoneNumber: username_or_email };
    } else {
      // loginFilter = { username: username_or_email }; // not wrong
      loginFilter = { email: username_or_email }; // delete this line after testing phase
    }
    return loginFilter;
  },
};
