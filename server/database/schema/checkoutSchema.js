const bookSchema = require("./bookSchema");
const userSchema = require("./userSchema");

let Schema = {};

Schema.createSchema = (mongoose) => {
  let checkoutSchema = mongoose.Schema({
    book: {type: mongoose.ObjectId, required: true},
    user: {type: mongoose.ObjectId, required: true},
    date: {type: Date, required: true},
    returnDate: {type: Date, required: true},
  });

  console.log('checkoutSchema is defined.');

  return checkoutSchema;

};

module.exports = Schema;