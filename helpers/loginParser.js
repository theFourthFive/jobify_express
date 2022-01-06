module.exports = {
  loginParser: (username_or_email) => {
   
    let loginFilter = {};
    if (username_or_email.includes("@")) {
      loginFilter = { email: username_or_email };
    } else {
      loginFilter = { username: username_or_email };
    }
    return loginFilter;
  },
};
