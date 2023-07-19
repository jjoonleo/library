const checkoutSchema = require("./checkoutSchema");

let Schema = {};

Schema.createSchema = (mongoose) => {
  let bookSchema = mongoose.Schema({
    title: { type: String, required: true},
    available: {type: mongoose.ObjectId},
    author: {type: String, required: true},
    publisher: {type: String, required: true},
    description: {type: String},
    img: {type:String},
    isbn: {type:String},
  });

  bookSchema.methods.toClient = function(){
      var obj = this.toObject();
  
      //Rename fields
      obj.id = obj._id;
      delete obj._id;
  
      return obj;
  }

  console.log('bookSchema is defined.');

  return bookSchema;

};
module.exports = Schema;