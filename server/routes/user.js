const express = require("express");
const router = express.Router();
let { tryCatch } = require("../utils/tryCatch");
const fs = require("fs");
const passport = require("passport");

router.use((req, res, next) => {
  console.log("user middleware is called");
  next();
});

router.get(
  "/login",
  tryCatch(async (req, res, next) => {
    console.log("get /login called");
    res.send("<h1>hi</hi>");
  })
);

router.post(
  "/getInfo",
  passport.authenticate("jwt", { session: false }),
  tryCatch(async (req, res, next) => {
    console.log(`post /getInfo called `);

    return res.status(200).json(req.user.forClient());
  })
);

router.post(
  "/login",
  tryCatch(async (req, res, next) => {
    console.log(req.body);
    console.log(`post /login called `);

    let database = req.app.get("database");
    let user = await database.User.findOne({ email: req.body.email });

    if (!user) {
      console.log("could not find user");
      return res.status(401).json({ msg: "could not find user" });
    }

    let authenticated = user.authenticate(req.body.password);

    if (!authenticated) {
      console.log("wrong password");
      return res.status(401).json({ msg: "you entered the wrong password" });
    }

    console.log("succesfuly logged in");
    const tokenObject = user.issueJWT(user);
    console.log(user);
    return res.status(200).json(user.forClient(tokenObject.token));
  })
);

router.post(
  "/signup",
  tryCatch(async (req, res) => {
    console.log("post '/signup' called");
    console.log(`email : ${req.body.email}  password: ${req.body.password}\n`);
    let database = req.app.get("database");

    // 모델 인스턴스 객체 만들어 저장
    let user = new database.User({
      email: req.body.email,
      name: req.body.name,
      classroom: req.body.classroom,
      grade: req.body.grade,
      number: req.body.number,
      maxNumber: 2,
    });

    console.log(user);
    await user.encryptPassword(req.body.password);

    await user.save();

    console.log("succesfuly signed up");
    const tokenObject = user.issueJWT(user);
    console.log(user.forClient(tokenObject.token));
    return res.status(200).json(user.forClient(tokenObject.token));
  })
);

module.exports = router;
