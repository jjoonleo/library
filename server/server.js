require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const request = require("request");

const config = require("./config");
const database = require("./database/database");
const route_loader = require("./routes/route_loader");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

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

app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log("??");
    return res.status(200).json({
      success: true,
      msg: "You are successfully authenticated to this route!",
      user: req.user.forClient(""),
    });
  }
);

app.use(
  router.use((req, res, next) => {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
    next();
  })
);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  await database.init(app, config);
  require("./config/passport")(passport);
});

request.post(
  "https://m.megabox.co.kr/on/oh/ohb/SimpleBooking/selectBokdList.do",
  {
    json: {
      brchNo1: "1351_DBC",
      flag: "DATE",
      menuId: "M-RE-TH-02",
      playDe: "20230721",
      sellChnlCd: "MOBILEWEB",
      sortMthd: "2",
    },
  },
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  }
);
