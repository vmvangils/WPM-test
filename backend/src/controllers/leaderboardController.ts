import { Request, Response } from 'express';
import { saveScore, getLeaderboard } from '../models/Score';

// deze functie slaat een score op in de leaderboard
export const submitScore = async (req: Request, res: Response) => {
  try {
    const { username, wpm } = req.body;
    await saveScore({ username, wpm });
    res.status(201).json({ message: 'Score saved successfully' });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
};

// deze functie haalt de top scores op van de leaderboard
export const getTopScores = async (req: Request, res: Response) => {
  try {
    const scores = await getLeaderboard();
    res.json(scores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}; 