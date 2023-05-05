require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");

const config = require("./config");
const database = require("./database/database");
const route_loader = require("./routes/route_loader");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 8000;

let router = express.Router();
route_loader.init(app, router);

app.get("/hi", (req, res) => {
  console.log("/ called");
  console.log(req.app.get("database").Test);
  res.json({
    msg: "hello world!",
  });
});

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  console.log("??");
  return res.status(200).json({
    success: true, 
    msg: "You are successfully authenticated to this route!",
    user: req.user.forClient(""),
  });
});

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  await database.init(app, config);
  require("./config/passport")(passport);
});
