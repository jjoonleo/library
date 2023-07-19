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
    console.log(req.query?.id ? req.query?.id[0] : null);
    let values = await db.Book.find(
      req.query?.id ? {_id: req.query?.id[0]} : null,
    );
    //console.log(values);
    return res
      .status(200)
      .json({ values: values.map((value) => value.toClient()) });
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

    if (book.available != null) {
      console.log("not available book");
      return res.status(400).json({ msg: "not available book" });
    }

    let today = new Date();
    let dueDate = new Date();
    dueDate.setDate(today.getDate() + config.loanPeriod);
    let checkout = new db.Checkout({
      book: book.id,
      user: req.user.id,
      date: today,
      returnDate: null,
      dueDate: dueDate,
    });

    let saved_checkout = await checkout.save();
    await db.Book.updateOne(book, { available: saved_checkout.id });
    await db.User.updateOne(req.user, {
      borrowedBooks: [...req.user.borrowedBooks, saved_checkout.id],
    });
    // await book.update
    return res.status(200).json(saved_checkout.toClient());
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
    let checkout_id = book.available;
    let checkout = await db.Checkout.findById(checkout_id);
    await db.Checkout.updateOne(checkout, { returnDate: Date() });
    await db.Book.updateOne(book, { available: null });

    const index = req.user.borrowedBooks.indexOf(checkout_id);
    console.log(index);
    console.log(checkout_id);
    if (index > -1) {
      await db.User.updateOne(req.user, {
        borrowedBooks: req.user.borrowedBooks.splice(index, 1),
      });
    }
    await db.User.updateOne({_id:req.user.id}, {borrowedBooks:req.user.borrowedBooks});
    return res.status(200).json(book.toClient());
  })
);
router.get(
  "/checkouts",
  passport.authenticate("jwt", { session: false }),
  tryCatch(async (req, res) => {
    console.log("get /checkouts");

    let db = req.app.get("database");
    let checkouts = [];
    for (let i = 0; i < req.user.borrowedBooks.length; i++) {
      let result = await db.Checkout.findById(req.user.borrowedBooks[i]);
      checkouts.push(result?.toClient());
    }
    console.log(checkouts);
    return res.status(200).json({ values: checkouts });
  })
);

router.get(
  "/checkoutByBookId",
  passport.authenticate("jwt", { session: false }),
  tryCatch(async (req, res) => {
    console.log("get /checkoutByBookId");
    console.log(`id: ${req.query?.id ? req.query?.id[0] : null}`);
    let db = req.app.get("database");
    let checkout = await db.Checkout.findOne({
      user: req.user.id,
      book: req.query?.id ? req.query?.id[0] : null,
      returnDate:null
    });
    checkout = checkout?.toClient();
    console.log(checkout);
    return res.status(200).json(checkout);
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
