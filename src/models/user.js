const mongoose = require("mongoose");
const validator = require("validator");

const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid and uncorrect");
      }
    },
  },
  age: {
    type: Number,
    default: 18,
    validate(val) {
      if (val <= 0) {
        throw new Error("age must be a positive number");
      }
    },
  },
  city: {
    type: String,
  },
});

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcryptjs.hash(user.password, 10);
  }
});




// login

userSchema.statics.findByCredentials = async (em, pass) => {
  const user = await User.findOne({ email: em });
  if (!user) {
    throw new Error("unable to find login");
  }

  const isMatch = await bcryptjs.compare(pass, user.password);

  if (!isMatch) {
    throw new Error("unable to login");
  }

  return user;
};



const User = mongoose.model("User", userSchema);
module.exports = User;
