const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Note = require('./models/Note');

//Database Connection
//bobotanga

connectDB = async () => {
  const conn = await mongoose.connect(
    'mongodb+srv://lendlc:L3ndlc12@cluster0.9fygk.mongodb.net/note',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  );
  //display to console that successfuly nag connect sa DB
  console.log(`Connected to DB: ${conn.connection.host}`);
};

//initialize database connection
connectDB();

//allow the use of JSON Data format
app.use(express.json());

// @desc        get all notes
// @router      GET http://localhost:3500/v1/notes/
// @access      Public
app.get('/api/notes', async (req, res) => {

  //get all notes from the database and assign it to the variable notes
  const notes = await Note.find({});

  //sends back to client all the notes found from the database in JSON format
  res.status(200).json({ notes });
});

// @desc        get single note by ID
// @router      GET http://localhost:3500/v1/notes/:id
// @access      Public
app.get('/api/notes/:id', async (req, res) => {

  //validates if the id supplied in the url paramter is a valid mongoDB id
  if (mongoose.Types.ObjectId.isValid(req.params.id) != true) {
    //returns a resonse code of 400 with appropriate error message
    return res.status(404).json({ success: false, error: 'note not found' });
  }

  //proceed to query a note by the verified url paramter ID
  const note = await Note.findById(req.params.id);

  //sends a reponse code of 200 which means, the request is a success
  res.status(200).json({ note });
});

// @desc        create single note
// @router      POST http://localhost:3500/v1/notes/
// @access      Public
app.post('/api/notes', async (req, res) => {
  //gets the title and description field from req.body
  const { title, description } = req.body;

  //checks if title is present in the request, sends error response if not found
  if (!title) return res.status(400).json({ success: false, error: 'title is required' });

  //checks if title is description in the request, sends error response if not found
  if (!description)
    return res.status(400).json({ success: false, error: 'description is required' });

  //proceed to create a Note if all validations passed
  const note = await Note.create(req.body);

  //sends a status code of 201 which means resouce has been created, 
  //together with the note created
  res.status(201).json({ note });
});

// @desc        update single note by ID
// @router      PUT http://localhost:3500/v1/notes/:id
// @access      Public
app.put('/api/notes/:id', async (req, res) => {
  
  //again, validate if the id supplied from the request is valid
  if (mongoose.Types.ObjectId.isValid(req.params.id) != true) {
    //if false, returns the proper status code and message
    return res.status(404).json({ success: false, error: 'note not found' });
  }

  //proceed to query the note by its id, and update it with supplied data from req.body
  const note = await Note.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  //sends a status code of 200 which means request is a success 
  //together with the updated note
  res.status(200).json({ note });
});

// @desc        delete single note by ID
// @router      DELETE http://localhost:3500/v1/notes/:id
// @access      Public
app.delete('/api/notes/:id', async (req, res) => {
  
  //kung binasa mo yung nasa taas alam mo na to
  if (mongoose.Types.ObjectId.isValid(req.params.id) != true) {
    //kung hindi, edi wow
    return res.status(400).json({ success: false, error: 'note not found' });
  }

  //alam mo na din dapat ginagawa neto, pero this time, syempre delete diba
  const note = await Note.findByIdAndDelete({ _id: req.params.id });

  //alam mo na rin dapat to
  res.status(200).json({ success: true });
});

//Hope you undertand

const PORT = 3500;
app.listen(PORT, console.log(`API Running at PORT ${PORT}`));
