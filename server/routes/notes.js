const { Note, validate } = require("../models/Note");
const { User } = require("../models/User");
const express = require("express");
const passport = require("passport");
const router = express.Router();
const requireAuth = passport.authenticate("jwt", { session: false });

router.get("/:username/", requireAuth, async (req, res) => {
  const user = await User.findOne({ userName: req.params.username });
  if (!user) return res.status(404).send("The user was not found.");
  if (req.user._id.toString() !== user._id.toString())
    return res.status(401).send("Unauthorized");
  const notes = await Note.find({ userId: user._id }).sort("-date");
  res.send(notes);
});

router.post("/", requireAuth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newNote = new Note({
    title: req.body.title,
    note: req.body.note,
    userId: req.body.userId
  });

  newNote.save().then(post => res.json(post));
});

router.put("/:id", requireAuth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const note = await Note.findById(req.params.id);
  if (!note)
    return res.status(404).send("The note with the given ID was not found.");
  if (note.userId.toString() !== req.user._id.toString())
    return res.status(401).send("Unauthrized");

  Note.updateOne(note, {
    title: req.body.title,
    note: req.body.note
  });
  note.save();

  
  // const note = await Note.findByIdAndUpdate(
  //   req.params.id,
  //   {
  //     title: req.body.title,
  //     note: req.body.note
  //   },
  //   { new: true }
  // );

  res.send(note);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note)
    return res.status(404).send("The note with the given ID was not found.");
  if (note.userId.toString() !== req.user._id.toString())
    return res.status(401).send("Unauthrized");

  await Note.deleteOne(note);
  res.send(note);
});

module.exports = router;
