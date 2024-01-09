const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Dummy database to store user data
const usersDB = [];

// Middleware to parse JSON
app.use(bodyParser.json());

// User Registration and Authentication
app.post('/api/user/register', (req, res) => {
  const { name, address, uniqueIdentifier, password } = req.body;

  // Dummy verification logic
  if (!name || !address || !uniqueIdentifier || !password) {
    return res.status(400).json({ error: 'Missing required information.' });
  }

  // Assign a unique voter ID (you might use a library for this)
  const voterID = generateUniqueID();

  // Store user data in the database
  const newUser = {
    voterID,
    name,
    address,
    uniqueIdentifier,
    password, // In a real app, this should be securely hashed
  };
  usersDB.push(newUser);

  res.status(201).json({ voterID });
});

// Ballot Casting
app.post('/api/vote/cast', (req, res) => {
  const { voterID, electionID, candidateID } = req.body;

  // Dummy verification logic
  if (!voterID || !electionID || !candidateID) {
    return res.status(400).json({ error: 'Missing required information.' });
  }

  // Check if the user is logged in (you might use a session token or JWT)
  const user = usersDB.find((user) => user.voterID === voterID);
  if (!user) {
    return res.status  (401).json({ error: 'User not authorized.' });
  }

  // Dummy logic for confirming the vote
  // In a real app, you'd update the database with the vote
  const confirmationMessage = `Vote for candidate ${candidateID} confirmed.`;
  res.status(200).json({ message: confirmationMessage });
});

// Result Tabulation
app.get('/api/election/results', (req, res) => {
  const { electionID } = req.query;

  // Dummy verification logic
  if (!electionID) {
    return res.status(400).json({ error: 'Missing election ID.' });
  }

  // Dummy logic for result tabulation (you might use a database)
  const results = calculateElectionResults(electionID);
  res.status(200).json({ results });
});

// Dummy function to generate a unique ID
function generateUniqueID() {
  return Math.random().toString(36).substring(2, 15);
}

// Dummy function for result tabulation
function calculateElectionResults(electionID) {
  // In a real app, you'd fetch data from the database and perform calculations
  const dummyResults = {
    candidate1: 150,
    candidate2: 120,
    candidate3: 80,
  };

  return dummyResults;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});