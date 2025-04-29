import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TypingTest from './TypingTest';
import './Home.css';

const Home: React.FC = () => {
    const [wpm, setWpm] = useState<number | null>(null);
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleTestComplete = (finalWpm: number, finalAccuracy: number) => {
        setWpm(finalWpm);
        setAccuracy(finalAccuracy);
    };

    return (
        <div className="home">
            <h1>Welcome to the Typing Test</h1>
            <div className="test-container">
                {wpm !== null && accuracy !== null ? (
                    <div className="test-results">
                        <h2>Your Results</h2>
                        <p>Words Per Minute: {wpm}</p>
                        <p>Accuracy: {accuracy}%</p>
                        <button onClick={() => {
                            setWpm(null);
                            setAccuracy(null);
                        }}>
                            Try Again
                        </button>
                    </div>
                ) : (
                    <TypingTest onTestComplete={handleTestComplete} />
                )}
            </div>
        </div>
    );
};

export default Home; 