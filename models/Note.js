const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Note', NoteSchema);
