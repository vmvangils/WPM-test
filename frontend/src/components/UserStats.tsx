import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import './UserStats.css';

import {
    // chart.js is een library voor het maken van grafieken
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
// dit is de interface voor de test data, als een gebruiker nog geen test heeft gedaan laat het de placeholder zien
interface TypingTest {
    id: number;
    user_id: number;
    wpm: number;
    accuracy: number;
    test_duration: number;
    created_at: string;
}
// dit laat de hoogste wpm, gemiddelde wpm en het aantal tests zien, dit word opgehaald uit de database
interface UserStatsData {
    highest_wpm: number;
    average_wpm: number;
    total_tests: number;
}
// dit is de leaderboard, dit word opgehaald uit de database
interface LeaderboardEntry {
    username: string;
    highest_wpm: number;
    average_wpm: number;
    total_tests: number;
}
// dit is de component voor de user stats, dit word opgehaald uit de database
const UserStats: React.FC = () => {
    const [stats, setStats] = useState<UserStatsData | null>(null);
    const [history, setHistory] = useState<TypingTest[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [visibleHistoryCount, setVisibleHistoryCount] = useState(7); 
// Dit haalt de hoogste WPM, gemiddelde WPM en het aantal tests op en laat het zien.
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            setLoading(true);
            setError(null);
            
            try {
                // This will fetch the leaderboard, stats and history from the database.
                const leaderboardPromise = api.get('/typing/leaderboard');
                const statsPromise = api.get<UserStatsData>(`/typing/stats/${user.id}`);
                const historyPromise = api.get<TypingTest[]>(`/typing/history/${user.id}`);
                const [leaderboardResponse, statsResponse, historyResponse] = await Promise.all([
                    leaderboardPromise,
                    statsPromise,
                    historyPromise
                ]);

                console.log('History response:', historyResponse.data);

                setLeaderboard(leaderboardResponse.data || []);
                setStats(statsResponse.data || { highest_wpm: 0, average_wpm: 0, total_tests: 0 });
                setHistory(historyResponse.data || []);
                
            } catch (err) {
                // dit laat een error zien als er iets mis gaat
                console.error('Error fetching data:', err);
                setError('Failed to fetch data. Please try again later.');
                setStats({ highest_wpm: 0, average_wpm: 0, total_tests: 0 }); 
                setHistory([]);
                setLeaderboard([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);
// dit is de wpm distribution, dit word opgehaald uit de database
    const wpmBins = Array.from({ length: 16 }, (_, i) => `${i * 10} - ${i * 10 + 9}`); 
    const wpmCounts = Array(16).fill(0);
// Dit is de history, dit word opgehaald uit de database
    if (history.length > 0) {
        history.forEach(test => {
            const wpm = Math.floor(test.wpm);
            const binIndex = Math.floor(wpm / 10);
            if (binIndex >= 0 && binIndex < wpmCounts.length) {
                wpmCounts[binIndex]++;
            }
        });
    }


    // dit is de chart data, dit word opgehaald uit de database 
    const chartData = {
        labels: wpmBins,
        datasets: [
            {
                label: 'Number of Tests', 
                data: wpmCounts,
                backgroundColor: '#564D36',
                borderColor: '#3E3727', 
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, 
            },
            title: {
                display: true,
                text: 'WPM Distribution',
                color: '#e0e0e0', 
                font: { size: 16 },
            },
            tooltip: {
                backgroundColor: '#2a2d31', 
                titleColor: '#e0e0e0',
                bodyColor: '#b0b0b0',
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'WPM Range',
                    color: '#b0b0b0' 
                },
                ticks: {
                    color: '#b0b0b0', 
                },
                grid: {
                    color: '#444', 
                    borderColor: '#555' 
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Tests',
                    color: '#b0b0b0'
                },
                ticks: {
                    color: '#b0b0b0', 
                    precision: 0 
                },
                grid: {
                    color: '#444', 
                    borderColor: '#555' 
                },
                suggestedMax: 25 
            },
        },
    };
    

    if (loading) {
        return <div className="loading">Loading statistics...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!stats) {
        return <div className="loading">Loading statistics...</div>;
    }

    // This is the "Show More" button.
    const formatDate = (dateString: string) => {
        try {
            if (!dateString) {
                console.error('Date string is undefined or null');
                return 'Invalid date';
            }
            
            // dit voegt de datum toe aan de history
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.error('Invalid date:', dateString);
                return 'Invalid date';
            }
            // Shows the date as day/month/year
            return date.toLocaleString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).replace(',', '');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };
    // Function for show more history, after 7 tests it will show the button.
    const handleShowMoreHistory = () => {
        setVisibleHistoryCount(prevCount => prevCount + 7);
    };
// Shows the user stats.
    return (
        <div className="stats-container">
            <h2>Your Statistics</h2>
            {stats ? (
                 <div className="user-stats-combined">
                    <div className="stat-item">
                        <h3>Highest WPM</h3>
                        {/* If stats.highest_wpm has something in it, (not null/undefined/empty), use the highest wpm from the stats. Otherwise, use 0 as a fallback */}
                        <p className="stat-value">{Number(stats.highest_wpm || 0).toFixed(1)}</p>
                    </div>
                    <div className="stat-item">
                        <h3>Average WPM</h3>
                        {/* Same thing as above, but for the average wpm. */}
                        <p className="stat-value">{Number(stats.average_wpm || 0).toFixed(1)}</p>
                    </div>
                    <div className="stat-item">
                        <h3>Total Tests</h3>
                        {/* This will see if any stats.total_tests are available, if not it will just show 0. */}
                        <p className="stat-value">{stats.total_tests || 0}</p>
                    </div>
                </div>
            ) : (
                 <p className="no-history">No statistics available</p> 
            )}
{/* dit is de leaderboard, dit laat zien wat de top 10 hooghste wpm zijn. */}
            <div className="leaderboard-section">
                <h2>Top 10 Highest WPM</h2>
                {/* The "0" will see if the leaderboard has any entries. */}
                <div className="leaderboard-grid">
                    {leaderboard.length > 0 ? (
                        leaderboard.map((entry, index) => ( 
                            // de #1 in de leaderboard krijgt een gouden kleur.
                            <div key={index} className={`leaderboard-card ${index === 0 ? 'gold' : ''}`}>
                                <div className="leaderboard-rank">#{index + 1}</div>
                                <div className="leaderboard-info">
                                    <div className={`leaderboard-username ${index === 0 ? 'gold' : ''}`}>
                                        {entry.username}
                                    </div>
                                    {/* // dit laat de hoogste wpm, gemiddelde wpm en het aantal tests zien bij de kaarten van de gebruikers */}

                                    {/* // toFixed(1) means that the number will be rounded to 1 decimal place. 0.0 means that it starts at 0, and that is how it will show. */}
                                    <div className="leaderboard-stats">
                                        <span>Highest WPM: {Number(entry.highest_wpm)?.toFixed(1) || '0.0'}</span>
                                        <span>Average WPM: {Number(entry.average_wpm)?.toFixed(1) || '0.0'}</span>
                                        <span>Total Tests: {entry.total_tests || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Als er geen gebruikers zijn in de leaderboard, laat dit zien.
                        <p className="no-history">No leaderboard data available</p>
                    )}
                </div>
            </div>
            {/* // dit is de history, dit laat zien wat de gebruiker heeft gedaan. */}
            {/* Test History Section */}
            <div className="history-section">
                <h2>Test History</h2>
                {history.length === 0 ? (
                    <p className="no-history">No test history available</p>
                ) : (
                    <>
                    {/* // history kaart in the history page. */}
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>WPM</th>
                                    <th>Accuracy</th>
                                </tr>
                            </thead>
                            <tbody>
                             {/* This will show the "Test History", history.slice(0, visibleHistoryCount).map((test) is used to show the first 7 tests, and then the rest will be shown when the button is clicked. */}
                                {history.slice(0, visibleHistoryCount).map((test) => (
                                    <tr key={test.id}>
                                        <td>{formatDate(test.created_at)}</td>
                                        <td>{Number(test.wpm).toFixed(1)}</td>
                                        <td>{Number(test.accuracy).toFixed(1)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {visibleHistoryCount < history.length && (
                            <button 
                                className="show-more-button" 
                                onClick={handleShowMoreHistory}
                            >
                                Show More
                            </button>
                        )}
                    </>
                )}
            </div>
            {/* This is the "WPM Distribution" chart. */}
            
            <div className="wpm-distribution-section">
                <div className="chart-container" style={{ height: '300px', position: 'relative' }}> 
                    {history.length > 0 ? (
                         <Bar options={chartOptions} data={chartData} />
                    ) : (
                         <p className="no-history">No test data available for chart</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserStats; 