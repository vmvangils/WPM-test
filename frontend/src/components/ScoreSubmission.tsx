import React, { useState } from 'react';
import axios from 'axios';

interface ScoreSubmissionProps {
  score: number;
  onScoreSubmit: () => void;
}

const ScoreSubmission: React.FC<ScoreSubmissionProps> = ({ score, onScoreSubmit }) => {
  // Maakt een variabele genaamd username aan om de gebruikersnaam op te slaan
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Stuurt de score naar de backend met Axios library
      await axios.post('http://localhost:3001/api/leaderboard/submit', {
        username,
        wpm: score
      });
      onScoreSubmit(); // Roept de callback functie aan na succesvol versturen
      setUsername(''); // Reset de gebruikersnaam veld
    } catch (error) {
    }
  };
  // This will show the score submission form.
  return (
    <div className="score-submission">
      <h2>Verstuur je score: {score} WPM</h2>
      <form onSubmit={handleSubmit}>
        <input
        // This will show the username input field.
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <button type="submit">Verstuur Score</button>
      </form>
    </div>
  );
};

export default ScoreSubmission;