import { Request, Response } from 'express';
import pool from '../config/database';

// deze functie haalt de statistieken op van een gebruiker
export const getUserStats = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        
        // controleer of het user ID geldig is
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // haal de statistieken op uit de database
        const [rows] = await pool.execute(
            'SELECT * FROM user_statistics WHERE user_id = ?',
            [userId]
        );

        // als er geen statistieken zijn, geef dan standaard waarden terug
        const stats = (rows as any[])[0] || {
            highest_wpm: 0,
            average_wpm: 0,
            total_tests: 0
        };

        res.json(stats);
    } catch (error) {
        console.error('Error getting user stats:', error);
        res.status(500).json({ error: 'Failed to get user statistics' });
    }
}; 