const mongoose = require('mongoose');
const db = require("../config/keys").mongoURI;

module.exports = function() {
  mongoose.connect(db)
    .then(() => console.log(`Connected to ${db}...`))
}