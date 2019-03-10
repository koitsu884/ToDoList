const express = require("express");
const error = require('../middleware/error');
const users = require('../routes/users');
const notes = require('../routes/notes');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/notes', notes);
    app.use(error);
 }