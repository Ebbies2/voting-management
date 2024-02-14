const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const DB= 'mongodb+srv://ebbad:Immaheadout567@cluster0.qrlobyg.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(DB).then(() =>{
  console.log('connection sucessfull');
}).catch((err) => console.log('no connection',err));

const app = express();
const port = 5000;

// Dummy database to store user data
const usersDB = [];
// Dummy database to store votes
const votesDB = [];

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());





const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  address: String,
  uniqueIdentifier: String,
  password: String,
});

const voteSchema = new Schema({
  voterID: String,
  electionID: String,
  candidateID: String,
});

const User = mongoose.model('User', userSchema);
const Vote = mongoose.model('Vote', voteSchema);



// User Registration and Authentication
app.post('/api/user/register', async (req, res) => {
  const { name, address, uniqueIdentifier, password } = req.body;

  // Validation
  if (!name || !address || !uniqueIdentifier || !password) {
    return res.status(400).json({ error: 'Missing required information.' });
  }

  try {
    const newUser = await User.create({
      name,
      address,
      uniqueIdentifier,
      password,
    });
    res.status(201).json({ voterID: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ballot Casting
app.post('/api/vote/cast', async (req, res) => {
  const { voterID, electionID, candidateID } = req.body;

  // Validation
  if (!voterID || !electionID || !candidateID) {
    return res.status(400).json({ error: 'Missing required information.' });
  }

  try {
    const user = await User.findById(voterID);
    if (!user) {
      return res.status(401).json({ error: 'User not authorized.' });
    }

    await Vote.create({
      voterID,
      electionID,
      candidateID,
    });

    res.status(200).json({ message: 'Vote cast successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Result Tabulation
app.get('/api/election/results', async (req, res) => {
  const { electionID } = req.query;

  // Validation
  if (!electionID) {
    return res.status(400).json({ error: 'Missing election ID.' });
  }

  try {
    const results = await Vote.aggregate([
      { $match: { electionID } },
      { $group: { _id: '$candidateID', count: { $sum: 1 } } },
    ]);
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dummy function to generate a unique ID
function generateUniqueID() {
  return Math.random().toString(36).substring(2, 15);
}

// Dummy function for result tabulation
function calculateElectionResults(electionID) {
  const results = {};

  // Count votes for each candidate
  for (const vote of votesDB) {
    if (vote.electionID === electionID) {
      results[vote.candidateID] = (results[vote.candidateID] || 0) + 1;
    }
  }

  return results;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});