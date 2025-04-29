import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './Leaderboard.css';

// Leaderboard component for the application.
interface LeaderboardEntry {
    username: string;
    highest_wpm: number;
    average_wpm: number;
    total_tests: number;
}
// This will show the the actual leaderboard, uses a place holder and gives an error message if it fails to fetch the leaderboard.
const Leaderboard: React.FC = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get('/typing/leaderboard');
                setEntries(response.data);
            } catch (err: any) {
                console.error('Error fetching leaderboard:', err);
                setError(err.response?.data?.error || 'Failed to fetch leaderboard');
            }
        };

        fetchLeaderboard();
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>;
    }
// This is the leaderboard placeholder.
    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Highest WPM</th>
                        <th>Average WPM</th>
                        <th>Tests</th>
                    </tr>
                </thead>
                <tbody>
                    // This will send the data to the leaderboard.
                    {entries.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.username}</td>
                            <td>{entry.highest_wpm.toFixed(1)}</td>
                            <td>{entry.average_wpm.toFixed(1)}</td>
                            <td>{entry.total_tests}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard; 