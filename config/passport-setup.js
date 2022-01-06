/********************* Requires *********************/
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
let { keys } = require("./settings");
// const User = require("../models/user");

/****************** Helper Functions *****************/
const { whisp, gossip, yell, ignore } = require("../helpers/whisper");
ignore(gossip);

// passport don't use middleware, but strategies
// prettier-ignoresdfsdf
passport.use(
  new GoogleStrategy(
    {
      // options for the google strategy
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { name, given_name, family_name, email, email_verified, sub, picture } = profile._json
      ignore(accessToken, refreshToken, name)
      let gmailUser = {
        // fullname: name,
        firstname: given_name,
        lastname: family_name,
        email: email,
        gmail_verified: email_verified,
        googleId: sub,
        profile_image_uri: picture.slice(0, profile._json.picture.indexOf("=s96-c")),
      };

      try {
        let foundUser = await User.findOne({ email });
        // if user doesn't exist inside the database
        if (!foundUser) {
          // so we save it into the database
          savedUser = await new User(gmailUser).save();
          // whisp(savedUser);
          done(null, savedUser);
        } else {
          // the user exists already inside our databse
          // we update it
          updatedUser = await User.findByIdAndUpdate(
            { _id: foundUser._id },
            user,
            { new: true }
          );

          whisp("Updated user is:", updatedUser);
          done(null, updatedUser);
        }
      } catch (error) {
        yell(error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // this will attach the user id to the request
  // then, inside the app.js, the app.use(cookieSession()) middleware, will make sure if it's a daylong
  // then encrypting it
  // then will send it to the browser
  // and all of this is happened, once the user is logged in
});

passport.deserializeUser(async (id, done) => {
  // this callback function is executed each time when a user make a request
  // so on each request he send the encrypted cookie to be de-encrypted
  // then we can deserialize the user by grabbing the id
  // and assosiating it with a user in our database
  // so we know then what user is associated in a session
  // so we know that he's logged in, in that time
  try {
    let foundUser = await User.findById(id);
    done(null, foundUser);
  } catch (error) {
    done(error, null);
  }
});
