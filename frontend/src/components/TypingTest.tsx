import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import './TypingTest.css';

// Add type definition for process.env
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REACT_APP_POSTMAN_API_KEY: string;
        }
    }
}

interface TypingTestProps {
    onTestComplete?: (wpm: number, accuracy: number) => void;
}

interface TypingTestResult {
    id: number;
    user_id: number;
    wpm: number;
    accuracy: number;
    created_at: string;
}

enum WordStatus { Neutral, Correct, Incorrect }
// dit houd de typetest bij, het vergelijkt de gebruiker input met de correcte woorden en voegt de kleuren toe.
const TypingTest: React.FC<TypingTestProps> = ({ onTestComplete }) => {
    const { user } = useAuth();
    const [words, setWords] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [currentWordStatus, setCurrentWordStatus] = useState<WordStatus>(WordStatus.Neutral);
    const [input, setInput] = useState<string>('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isTestActive, setIsTestActive] = useState<boolean>(false);
    const [testResults, setTestResults] = useState<TypingTestResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [correctChars, setCorrectChars] = useState<number>(0);
    const [totalCharsEntered, setTotalCharsEntered] = useState<number>(0);  
    const [correctlyCompletedChars, setCorrectlyCompletedChars] = useState<number>(0); 
    const [liveWpm, setLiveWpm] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // dit maakt een connectie naar de postman api en haalt de woorden op
    const fetchRandomWords = useCallback(async () => {
        try {
            setIsLoading(true);
            console.log('Making request to Postman API...');
            
            const requestResponse = await fetch('https://api.postman.com/collections/41981356-1328428e-6f7b-42f1-aaea-c15048a60802/requests/41981356-b90f12d2-5cff-42b6-b132-a8d51909f6b5', {
                method: 'GET',
                headers: {
                    'X-API-Key': process.env.REACT_APP_POSTMAN_API_KEY || '',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!requestResponse.ok) {
                throw new Error(`Failed to get request details: ${requestResponse.status} ${requestResponse.statusText}`);
            }
            // dit haalt de data op van de postman api
            const requestData = await requestResponse.json();
            console.log('Request details:', requestData);
            
            const requestUrl = requestData.data?.url || 'http://localhost:3000/api/words';
            // dit maakt een request naar de api
            console.log('Making request to:', requestUrl);
            const response = await fetch(requestUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // dit checkt of de request succesvol is
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to fetch words: ${response.status} ${response.statusText}`);
            }
            // dit haalt de data op van de api
            const data = await response.json();
            console.log('Words response:', data);
            // dit maakt een array van de woorden
            let wordsArray;
            if (typeof data === 'string') {
                wordsArray = data.split(' ');
            } else if (Array.isArray(data)) {
                wordsArray = data;
            } else if (typeof data.words === 'string') {
                wordsArray = data.words.split(' ');
            } else if (Array.isArray(data.words)) {
                wordsArray = data.words;
            } else {
                console.log('Unexpected response format:', data);
                throw new Error('Unexpected response format');
            }
            // dit checkt of er woorden zijn gevonden in de response
            if (!wordsArray || wordsArray.length === 0) {
                throw new Error('No words found in response');
            }
            // dit zet de woorden in de overtype veld, en laat de gebruiker beginnen
            // dit laat de timer zien, en de live wpm zien 
            setWords(wordsArray);
            setCurrentWordIndex(0);
            setCurrentWordStatus(WordStatus.Neutral);
            setInput('');
            setStartTime(null);
            setIsTestActive(false);
            setTestResults(null);
            setError(null);
            setCorrectChars(0);
            setTotalCharsEntered(0);
            setCorrectlyCompletedChars(0); 
            setLiveWpm(0);
            inputRef.current?.focus();
        } catch (err) {
            // dit laat zien of er een fout was
            console.error('Error fetching words:', err);
            setError('Failed to fetch words. Please try again.');
            setWords([]);
            // dit zet de woorden in de overtype veld, en laat de gebruiker beginnen
        } finally {
            setIsLoading(false);
        }
    }, []);
    // dit haalt de woorden op
    useEffect(() => {
        fetchRandomWords();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [fetchRandomWords]);
    // dit berekent de live wpm
    const calculateLiveWpm = useCallback(() => {
        if (!isTestActive || !startTime) {
            return 0;
        }
        const currentTime = Date.now();
        const elapsedTimeInMinutes = (currentTime - startTime) / 60000;
        if (elapsedTimeInMinutes <= 0) {
            return 0;
        }

        // Calculate total words completed (including current word if it's correct)
        let totalWords = currentWordIndex;
        const currentWord = words[currentWordIndex];
        
        // If current word is being typed correctly, count it as partially completed
        if (currentWord && input && currentWord.startsWith(input)) {
            totalWords += input.length / currentWord.length;
        }

        // Calculate WPM: words / minutes
        const calculatedWpm = Math.round(totalWords / elapsedTimeInMinutes);
        return calculatedWpm >= 0 ? calculatedWpm : 0;
    }, [isTestActive, startTime, currentWordIndex, words, input]);
    // dit is de functie die de input verwerkt
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const currentWord = words[currentWordIndex];
        let currentStartTime = startTime;

        if (!isTestActive && value.length > 0 && value !== ' ') {
            setIsTestActive(true);
            currentStartTime = Date.now();
            setStartTime(currentStartTime);
        }

        if (input.length === 0 && value === ' ') {
            return;
        }

        setInput(value);
        setError(null);

        if (currentWord) {
            const previousInput = input;
            const newInput = value;
            
            // Update total characters entered
            if (newInput.length < previousInput.length) {
                // When backspacing, remove the last character from total and correct counts
                setTotalCharsEntered((prev: number) => Math.max(0, prev - 1));
                // Only remove from correct count if the removed character was correct
                if (previousInput[previousInput.length - 1] === currentWord[previousInput.length - 1]) {
                    setCorrectChars((prev: number) => Math.max(0, prev - 1));
                }
            } else {
                const newChars = newInput.slice(previousInput.length);
                setTotalCharsEntered((prev: number) => prev + newChars.length);
                
                // Count correct characters in the new input
                const relevantPartOfWord = currentWord.slice(previousInput.length, newInput.length);
                const correctNewChars = newChars.split('').filter((char: string, index: number) => char === relevantPartOfWord[index]).length;
                setCorrectChars((prev: number) => prev + correctNewChars);
            }
        }

        let newStatus = currentWordStatus;
        if (!value.endsWith(' ') && currentWord) {  
            if (currentWord.startsWith(value)) {
                newStatus = WordStatus.Neutral;
            } else {
                newStatus = WordStatus.Incorrect;
            }
            setCurrentWordStatus(newStatus);
        }

        if (isTestActive || (!isTestActive && value.length > 0 && value !== ' ')) { 
            setLiveWpm(calculateLiveWpm());
        }

        if (value.endsWith(' ') && value.trim().length > 0) {
            const typedWord = value.trim();
            const currentWord = words[currentWordIndex];

            if (typedWord !== currentWord) {
                setCurrentWordStatus(WordStatus.Incorrect);
                setInput(typedWord);
                return;
            }

            // Only count the word as correct if it matches exactly
            if (typedWord === currentWord) {
                setCorrectlyCompletedChars((prev: number) => prev + currentWord.length);
                setCurrentWordStatus(WordStatus.Correct);
            }
            
            if (currentWordIndex === words.length - 1) {
                endTest(typedWord === currentWord);
            } else {
                setCurrentWordIndex((prev: number) => prev + 1);
                setInput('');
                setCurrentWordStatus(WordStatus.Neutral);
            }

            setLiveWpm(calculateLiveWpm());
        }
    }, [words, currentWordIndex, isTestActive, startTime, input, currentWordStatus, calculateLiveWpm]);
    // dit is de functie die de test eindigt
    const endTest = useCallback(async (lastWordCorrect: boolean) => {
        if (!startTime || !isTestActive) return;
        setIsTestActive(false);
        
        const endTime = Date.now();
        const timeInSeconds = (endTime - startTime) / 1000;
        const timeInMinutes = timeInSeconds / 60;
        
        // Calculate total words completed
        let totalWords = currentWordIndex;
        if (lastWordCorrect) {
            totalWords += 1;
        }
        
        // Calculate accuracy based on correct characters vs total characters
        // Ensure accuracy cannot exceed 100%
        const accuracy = Math.min(100, Math.round((correctChars / totalCharsEntered) * 100));
        
        // Calculate WPM based on words per minute
        const netWPM = timeInMinutes > 0 ? Math.round(totalWords / timeInMinutes) : 0;
        // dit kijkt of er een userId is
        try {
            if (!user || !user.id) {
                console.error('User not authenticated or missing ID:', user);
                throw new Error('You must be logged in to save test results');
            }
            // dit maakt een object met de test data
            const testData = {
                wpm: netWPM,
                accuracy: accuracy,
                user_id: user.id,
                test_duration: Math.round(timeInSeconds)
            };
            // dit logt de test data
            console.log('Attempting to save test results with data:', testData);
            const response = await api.post('/typing/save', testData);
            console.log('Test results saved successfully:', response.data);
            
            const savedResult = { ...response.data, id: response.data.id || Date.now(), created_at: new Date().toISOString(), user_id: user.id };
            setTestResults(savedResult);
            setError(null);
            
            if (onTestComplete) {
                onTestComplete(netWPM, accuracy);
            }
        } catch (err: any) {
            console.error('Error saving test results:', err);
            setError(err.response?.data?.message || err.message || 'Failed to save test results. Please try again.');
            setTestResults({ wpm: netWPM, accuracy: accuracy, id: Date.now(), user_id: user?.id || 0, created_at: new Date().toISOString() });
        }
    }, [startTime, isTestActive, correctlyCompletedChars, currentWordIndex, words, totalCharsEntered, correctChars, user, onTestComplete]);

    const restartTest = useCallback(() => {
        fetchRandomWords();
    }, [fetchRandomWords]);

    const getWordClass = useCallback((index: number): string => {
        if (index < currentWordIndex) {
            return 'completed'; 
        }
        // goed of fout checker
        if (index === currentWordIndex) {
            let statusClass = 'current';
            if (currentWordStatus === WordStatus.Correct) {
                statusClass += ' correct-word';
            } else if (currentWordStatus === WordStatus.Incorrect) {
                statusClass += ' incorrect-word';
            }
            return statusClass;
        }
        return '';
    }, [currentWordIndex, currentWordStatus]);
    // dit berekent de verstreken tijd
    const elapsedTime = useMemo(() => {
        return startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    }, [startTime]);

    return (
        <div className="typing-test">
            <div className="test-header">
                <h2>Typing Test,</h2>
                <h3> Press "Space" to go to the next word.</h3>
                <button onClick={restartTest} className="restart-button" title="Restart Test">
                    ↻
                </button>
            </div>
           
            {error && (
                // dit laat zien of er een fout is
                <div className="error-message">
                    <span>⚠️</span>
                    {error}
                </div>
            )}
            
            {isLoading ? (
                <div className="loading-message">Loading words...</div>
            ) : testResults ? (
                <div className="test-results">
                    <h3>Test Results</h3>
                    <div className="test-results-grid">
                        <div className="result-item">
                            <h4>Words Per Minute</h4>
                            <p>{testResults.wpm}</p>
                        </div>
                        <div className="result-item">
                            <h4>Accuracy</h4>
                            <p>{testResults.accuracy}%</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="typing-test-wrapper">
                    <div className="words-container">
                        {/* // dit laat de woorden zien */}
                        {words.length > 0 ? (
                            words.map((word: string, index: number) => (
                                <span key={index} className={`word ${getWordClass(index)}`}>
                                    {word}
                                </span>
                            ))
                        ) : (
                            <div className="no-words-message">No words available</div>
                        )}
                    </div>
                    <input
                        // dit is de input veld
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        className="typing-input"
                        autoFocus
                        placeholder="Start typing..."
                        disabled={words.length === 0}
                    />
                    <div className="live-stats">
                        {/* // dit laat de live wpm zien */}
                        <span>WPM: {liveWpm}</span>
                        <span>•</span>
                        {/* // dit laat de verstreken tijd zien */}
                        <span>Time: {elapsedTime}s</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(TypingTest); 