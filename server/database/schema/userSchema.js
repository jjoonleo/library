const checkoutSchema = require("./checkoutSchema");

const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "../..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

let Schema = {};

Schema.createSchema = (mongoose) => {
  let userSchema = mongoose.Schema({
    email: { type: String, required: true },
    hash: { type: String },
    salt: { type: String },
    name: { type: String, required: true },
    number: { type: Number, required: true },
    grade: { type: Number, required: true },
    classroom: { type: Number, required: true },
    borrowedBooks: { type: Array },
    maxNumber: { type: Number, required: true },
  });

  console.log("userSchema");

  /**
   * encrypt password
   * @param {string} password password that you want to encrypt
   * @returns {object} {salt, hash}
   */

  userSchema.methods.forClient = function (token) {
    return {
      email: this.email,
      name: this.name,
      number: this.number,
      grade: this.grade,
      classroom: this.classroom,
      borrowedBooks: this.borrowedBooks,
      maxNumber: this.maxNumber,
      id: this._id,
      token: token,
    };
  };

  userSchema.methods.encryptPassword = function (password) {
    let salt = crypto.randomBytes(32).toString("hex");
    let hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    console.log(this);
    this.salt = salt;
    this.hash = hash;
  };

  userSchema.methods.authenticate = function (password) {
    var hash = crypto
      .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
      .toString("hex");
    return this.hash === hash;
  };

  userSchema.methods.issueJWT = function () {
    const _id = this._id;

    const expiresIn = "1d";

    console.log(`id:${_id}`);

    const payload = {
      sub: _id,
      iat: Date.now(),
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
      expiresIn: expiresIn,
      algorithm: "RS256",
    });

    return {
      token: "Bearer " + signedToken,
      expires: expiresIn,
    };
  };

  console.log("userSchema is defined.");

  return userSchema;
};

module.exports = Schema;
