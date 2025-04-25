const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  teacher:{ type: String, required: true },
  teacher_ID:{ type: Number, required: true },
});

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ClassTeacher:String,
  subjects: [subjectSchema],
});

module.exports = mongoose.model('classe', classSchema);
