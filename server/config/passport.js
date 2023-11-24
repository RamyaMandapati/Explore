const bCrypt = require("bcrypt-nodejs");
const jwtSecret = require("./jwtConfig");

const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

module.exports = (passport) => {
  const userModel = require("../models/user");

  const LocalStrategy = require("passport-local").Strategy;

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  function getAgeCategory(birthdate) {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    if (age >= 50) return "50+";
    if (age >= 41) return "41-50";
    if (age >= 31) return "31-40";
    if (age >= 20) return "20-30";
    return "Under 20";
  }
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      async (req, email, password, done) => {
        const generateHash = function (password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };
        const userObj = await userModel.findOne({
          email: email,
        });
        if (userObj) {
          return done(
            {
              message: "That email is already taken",
            },
            false
          );
        } else {
          const birthdate = new Date(req.body.dateOfBirth);
          const ageCategory = await getAgeCategory(birthdate);
          const userPassword = generateHash(password);
          const data = {
            email: email,
            password: userPassword,
            userName: req.body.userName,
            emailVerified: true,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            age: ageCategory,
          };
          const newUser = await userModel.create(data);
          if (newUser) {
            return done(null, newUser);
          }
          return done(null, false);
        }
      }
    )
  );

  //LOCAL SIGNIN
  //LOCAL SIGNIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with username
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      async (req, email, password, done) => {
        const isValidPassword = function (userpass, password) {
          return bCrypt.compareSync(password, userpass);
        };
        try {
          const user = await userModel.findOne({
            email: email,
          });
          if (!user) {
            return done(null, false, {
              message: "email does not exist",
            });
          }
          if (!isValidPassword(user.password, password)) {
            return done(null, false, {
              message: "Incorrect password.",
            });
          }
          return done(null, user);
        } catch (e) {
          console.log("Error:", err);
          return done(null, false, {
            message: "Something went wrong with your Signin",
          });
        }
      }
    )
  );

  const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret.secret,
  };

  // JWT Implementation
  passport.use(
    "jwt",
    new JWTStrategy(opts, async (jwt_payload, done) => {
      try {
        userModel
          .findOne({
            email: jwt_payload.email,
          })
          .then(function (user) {
            if (!user) {
              return done(null, false, {
                message: "email does not exist",
              });
            }
            return done(null, user);
          });
      } catch (e) {
        console.log("Error:", e);
        return done(null, false, {
          message: "Something went wrong with your Signin",
        });
      }
    })
  );
};
