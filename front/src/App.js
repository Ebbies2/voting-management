import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [voterID, setVoterID] = useState('');
  const [electionID, setElectionID] = useState('');
  const [candidateID, setCandidateID] = useState('');
  const [message, setMessage] = useState('');

  const registerUser = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', {
        name,
        address,
        uniqueIdentifier,
        password,
      });
      setVoterID(response.data.voterID);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const castVote = async () => {
    try {
      await axios.post('http://localhost:5000/api/vote/cast', {
        voterID,
        electionID,
        candidateID,
      });
      setMessage('Vote cast successfully.');
    } catch (error) {
      console.error('Error casting vote:', error);
    }
  };

  const getElectionResults = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/election/results', {
        params: {
          electionID,
        },
      });
      setMessage(`Election results: ${JSON.stringify(response.data.results)}`);
    } catch (error) {
      console.error('Error getting election results:', error);
    }
  };

  return (
    <div>
      <h1>Voting App</h1>
      <div>
        <h2>User Registration</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input
          type="text"
          placeholder="Unique Identifier"
          value={uniqueIdentifier}
          onChange={(e) => setUniqueIdentifier(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={registerUser}>Register</button>
        {voterID && <p>Voter ID: {voterID}</p>}
      </div>
      <div>
        <h2>Cast Vote</h2>
        <input type="text" placeholder="Election ID" value={electionID} onChange={(e) => setElectionID(e.target.value)} />
        <input
          type="text"
          placeholder="Candidate ID"
          value={candidateID}
          onChange={(e) => setCandidateID(e.target.value)}
        />
        <button onClick={castVote}>Cast Vote</button>
        {message && <p>{message}</p>}
      </div>
      <div>
        <h2>Get Election Results</h2>
        <input type="text" placeholder="Election ID" value={electionID} onChange={(e) => setElectionID(e.target.value)} />
        <button onClick={getElectionResults}>Get Results</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default App;
