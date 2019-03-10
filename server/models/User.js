const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const jwtPrivateKey = require("../config/keys").jwtPrivateKey;

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, userName: this.userName },
    jwtPrivateKey
  );
  return token;
};

const User = mongoose.model('users', userSchema);

const validateUser = function(user){
    const schema = {
        userName: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).max(20).required(),
        password2: Joi.string().required().valid(Joi.ref('password')).options({
          language: {
            any: {
              allowOnly: 'Passwords do not match',
            }
          } 
        })
    }

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;