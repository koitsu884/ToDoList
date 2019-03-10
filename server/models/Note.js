const mongoose = require('mongoose');
const Joi = require('joi');

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        require:true
    },
    title:{
        type:String,
        require: true,
        minlength: 5,
        maxlength: 50
    },
    note:{
        type:String,
        require: true,
        minlength: 5
    },
    date:{
        type:Date
    }
});

const Note = mongoose.model('notes', noteSchema);

const validateNote = function(note){
    const schema = {
        userId: Joi.objectId().required(),
        title: Joi.string().min(5).max(50).required(),
        note: Joi.string().min(5).required()
    }

    return Joi.validate(note, schema);
}

exports.Note = Note;
exports.validate = validateNote;