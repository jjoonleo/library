const express = require("express");
const router = express.Router();
let { tryCatch } = require("../utils/tryCatch");
const passport = require("passport");

router.use((req, res, next) => {
  console.log("book middleware is called");
  next();
});

router.get(
  "/",
  tryCatch(async (req, res) => {
    console.log("get / called");
    let db = req.app.get("database");
    let query = {};
    console.log(req.query);
    let values = await db.Book.find({
      id: req.query?.id ? req.query?.id[0] : null,
    });
    return res.status(200).json({ values: values.map((value) => value.toClient()) });
  })
);

router.get(
  "/borrow",
  passport.authenticate("jwt", { session: false }),
  tryCatch(async (req, res) => {
    console.log("get /borrow");
    if (!req.query?.id) {
      return res.status(400).json({
        msg: "id is required",
      });
    }
    let db = req.app.get("database");
    let book = await db.Book.findById(req.query.id[0]);

    if (book.Checkout != null) {
      res.status(400).json({ msg: "not available book" });
    }

    let checkout = new db.Checkout({
      book: book.id,
      user: req.user.id,
      date: new Date(),
      returnDate: new Date(),
    });

    let saved_checkout = await checkout.save();
    await db.Book.updateOne(book, { available: saved_checkout.id });
    await db.User.updateOne(req.user, {
      borrowedBooks: [...req.user.borrowedBooks, saved_checkout.id],
    });
    // await book.update
    return res.status(200).json({ success: true });
  })
);

router.get(
  "/return",
  passport.authenticate("jwt", { session: false }),
  tryCatch(async (req, res) => {
    console.log("get /return");
    if (!req.query?.id) {
      return res.status(400).json({
        msg: "id is required",
      });
    }
    let db = req.app.get("database");

    let book = await db.Book.findById(req.query.id[0]);
    await db.Book.updateOne(book, { available: null });

    const index = user.borrowedBooks.indexOf(5);

    if (index > -1) {
      await db.User.updateOne(user, {borrowedBooks: user.borrowedBooks.splice(index,1)});
    }
  })
);

router.post(
  "/save",
  tryCatch(async (req, res) => {
    console.log("post '/save' called");

    let db = req.app.get("database");

    let book = new db.Book(req.body);
    delete book.id;
    let result = await book.save();
    console.log(req.body);
    if (result) {
      console.log(`${result.name} successfuly added to database`);
      return res.status(201).json({
        result: result,
        message: `successfuly added ${result.name} to database`,
      });
    }
  })
);

module.exports = router;
