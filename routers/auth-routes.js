const router = require("express").Router();
const passport = require("passport");

const AuthController = require("../controllers/auth");

// http://localhost:9000/auth/login
router.post("/login", AuthController.signin);

// http://localhost:5000/auth/signup
router.post("/signup", AuthController.signup);

// http://localhost:9000/auth/logout
router.post("/logout", AuthController.logout);

// http://localhost:9000/auth/changepassword
router.post("/changepassword", AuthController.changePassword);

// http://localhost:9000/auth/forgotpassword/:hash_link
router.get("/forgotpassword/:hash_link", AuthController.getResetPassword_UI);

// http://localhost:9000/auth/forgotpassword/
router.post("/forgotpassword/", AuthController.forgotPassword);

// http://localhost:9000/auth/resetpassword/
router.post("/resetpassword/", AuthController.executeResetPassword);

// auth with google
/***********************************************************************************
    explanation: when a user click on "signin with google +"
    the router.get("/google", ...) will execute the middleware passport.authenticate()
    using the google authentication strategy ("google" as a 1st parameter)
    and redirect the user to the login interface of google
    then when the user succeded to signin with google,
    google will redirect the user to this endpoint /auth/google/redirect
/***********************************************************************************/
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// callback route for google to redirect to ...
/***********************************************************************************
    explanation: when a user is redirected to /auth/google/redirect after been
    logged in with google authentication ...
    This router.get("/google/redirect", ...) will execute 2 middlewares:

    1) The passport.authenticate() which exchange the code in the url,
    with a user data from google, then the google will send back the data to the server,
    that same user's data, will be attached to the request of the next middleware

    2) Then the callback function at the 3rd parameter, is recieving the response
    from the google as a request (1st parameter of the callback function),
    and must give to the user a response
/***********************************************************************************/
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  whisp("object", req.user);
  // res.send(req.user);
  res.redirect("/profile");
});

// auth logout (when a user click on logout)
router.get("/disconnect", (req, res) => {
  // handle with passport
  // res.send("logging out");
  req.logout(); // this method will kill the cookie life / make it expired
  res.redirect("/");
});

module.exports = router;
