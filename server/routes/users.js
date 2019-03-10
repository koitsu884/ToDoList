const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {User, validate} = require('../models/User');
const express = require('express');
const router = express.Router();

// router.get('/me', auth, async (req, res) => {
//   const user = await User.findById(req.user._id).select('-password');
//   res.send(user);
// });

router.post('/register', async (req, res) => {
  const { error } = validate(req.body); 
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ userName: req.body.userName });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['userName', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.json({ token });
});

router.post('/login', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ userName: req.body.userName });
  if (!user) return res.status(404).send(`User ${req.body.userName} was not found.`);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid user name or password.');

  const token = user.generateAuthToken();
  res.json({ token });
});


module.exports = router; 
