const express = require("express");
const cors = require("cors");
const passport = require("passport");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const routes = require("./routes");
//const {injectModel} = require('./modules/utils');
require("dotenv").config();
const port = process.env.NODE_LOCAL_PORT || 4000;
const connect = require("./config/connect");
//const mysqlConnect = require('./config/mysql_connect');
const jwtSecret = require("./config/jwtConfig");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const notificationModel = require("./models/notification.js");

//For BodyParser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(morgan("combined"));
//app.use(injectModel);
app.use(cors());
// For Passport
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use("/api", routes);
COREAPP = {};
//Sync Database

connect().then(() => {
  console.log("MongoDB setup complete!");
  require("./config/passport.js")(passport);
});

// mysqlConnect().then(() => {
// const models = require("./models");
// COREAPP.models = models;
// // load passport strategies
// require("./config/passport.js")(passport, models.user);
// models.sequelize.sync().then(function() {
//   console.log('MySQL setup complete!');
// }).catch(function(err) {
//   console.log(err, "Something went wrong with the MySQL Database Update!")
// });

app.post("/signin", (req, res, next) => {
  passport.authenticate(
    "local-signin",
    { session: false },
    (err, user, info) => {
      if (err) {
        console.log("err -> ", err);
        return res.status(500).json({ success: false, message: err }); // Send an error response and return to avoid further execution
      }
      if (!user) {
        return res
          .status(401)
          .json({ success: false, isAuthenticated: false, ...info }); // Send an error response and return to avoid further execution
      }

      req.login(user, (error) => {
        if (error) {
          console.log("error -> ", error);
          return res
            .status(500)
            .json({ success: false, message: "Error during login" }); // Send an error response and return
        }
        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, jwtSecret.secret, {
          expiresIn: 10080000,
        });
        res.cookie("dc_token", token, { httpOnly: true });
        res.json({
          info,
          success: true,
          isAuthenticated: true,
          user: user,
          token,
        });
      });
    }
  )(req, res, next);
});

app.post("/signup", (req, res, next) => {
  passport.authenticate("local-signup", (err, user, info) => {
    if (err) {
      console.log("err -> ", err);
      res.json({ success: false, message: err });
      next();
      return;
    }
    if (!user) {
      res.json({ success: false, isAuthenticated: false, data: info });
      return next();
    }
    req.login(user, (error) => {
      if (error) {
        console.log("error -> ", error);
        return res
          .status(500)
          .json({ success: false, message: "Error during signup" }); // Send an error response and return
      }
      const payload = { id: user.id, email: user.email };
      const token = jwt.sign(payload, jwtSecret.secret, {
        expiresIn: 10080000,
      });
      res.cookie("dc_token", token, { httpOnly: true });
      res.json({
        info,
        success: true,
        isAuthenticated: true,
        user: user,
        token,
      });
    });
  })(req, res, next);
});

app.post("/logout", (req, res) => {
  // req.logOut();
  req.session.destroy(() => {
    // destroy session data
    req.session = null;
    res.clearCookie("dc_token");
    res.json({ success: true });
  });
});

// app.get('*', function (req, res) {
//   res.sendFile(`${__dirname}/public/index.html`, (err) => {
//      if (err) {
//       console.log(err);
//        res.end(err.message);
//      }
//    });
// });

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineSocketUsers = [];
const addSocketUser = (username, socketId) => {
  !onlineSocketUsers.some((user) => user.username === username) &&
    onlineSocketUsers.push({ username, socketId });
};

const removeSocketUser = (socketId) => {
  onlineSocketUsers = onlineSocketUsers.filter(
    (user) => user.socketId !== socketId
  );
};

const getSocketUser = (username) => {
  return onlineSocketUsers.find((user) => user.username === username);
};

io.on("connect", function (socket) {
  socket.on("newSocketUser", (username) => {
    addSocketUser(username, socket.id);
    io.emit("socketUserInfo", socket.id);
  });

  socket.on("requestNotifications", async ({ senderName }) => {
    const receiver = getSocketUser(senderName);
    const notifications = await notificationModel
      .find({ receiveruserId: senderName })
      .sort({ timestamp: -1 });
    io.to(receiver.socketId).emit("getNotifications", notifications);
  });

  socket.on("disconnect", () => {
    removeSocketUser(socket.id);
  });
});

io.listen(5001);

module.exports = app;
