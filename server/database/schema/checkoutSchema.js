const bookSchema = require("./bookSchema");
const userSchema = require("./userSchema");

let Schema = {};

Schema.createSchema = (mongoose) => {
  let checkoutSchema = mongoose.Schema({
    book: { type: mongoose.ObjectId, required: true, ref: "Book" },
    user: { type: mongoose.ObjectId, required: true, ref: "User" },
    date: { type: Date, required: true },
    returnDate: { type: Date },
    dueDate: { type: Date, required: true },
  });

  console.log("checkoutSchema is defined.");

  checkoutSchema.methods.toClient = function () {
    let obj = this.toObject();

    //Rename fields
    obj.id = obj._id;
    delete obj._id;

    return obj;
  };

  return checkoutSchema;
};

module.exports = Schema;
