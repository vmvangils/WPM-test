import { Request, Response } from 'express';
import { TypingTestModel } from '../models/typingTest';

// deze functie slaat een typetest resultaat op
export const saveTypingTest = async (req: Request, res: Response) => {
    try {
        const { wpm, accuracy, time } = req.body;
        const userId = req.body.userId; 

        // controleer of er een user ID is
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await TypingTestModel.saveTest(userId, wpm, accuracy, time);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error saving typing test:', error);
        res.status(500).json({ error: 'Failed to save typing test' });
    }
};

// deze functie haalt de typetest geschiedenis op van een gebruiker
export const getTypingHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId; 

        // controleer of er een user ID is
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const history = await TypingTestModel.getHistory(parseInt(userId));
        res.json(history);
    } catch (error) {
        console.error('Error getting typing history:', error);
        res.status(500).json({ error: 'Failed to get typing history' });
    }
};

// deze functie haalt de leaderboard op
export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const leaderboard = await TypingTestModel.getLeaderboard();
        res.json(leaderboard);
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        res.status(500).json({ error: 'Failed to get leaderboard' });
    }
};

// deze functie slaat een test resultaat op
export const saveTestResult = async (req: Request, res: Response) => {
    try {
        console.log('Full request body:', req.body);
        console.log('Request headers:', req.headers);
        console.log('Request cookies:', req.cookies);

        const { wpm, accuracy, user_id, test_duration } = req.body;

        // log de geparsede waarden
        console.log('Parsed values:', {
            wpm: typeof wpm,
            accuracy: typeof accuracy,
            user_id: typeof user_id,
            test_duration: typeof test_duration,
            values: { wpm, accuracy, user_id, test_duration }
        });

        // controleer of er een user ID is
        if (typeof user_id === 'undefined' || user_id === null) {
            console.error('Missing or invalid user_id:', user_id);
            return res.status(400).json({ 
                error: 'User ID is required',
                received: req.body
            });
        }

        // controleer of alle vereiste velden aanwezig zijn
        if (typeof wpm === 'undefined' || typeof accuracy === 'undefined' || typeof test_duration === 'undefined') {
            console.error('Missing required fields:', { wpm, accuracy, test_duration });
            return res.status(400).json({ 
                error: 'Missing required fields',
                received: { wpm, accuracy, test_duration }
            });
        }

        // maak een object met de test data
        const testData = {
            user_id: Number(user_id),
            wpm: Number(wpm),
            accuracy: Number(accuracy),
            test_duration: Number(test_duration),
            created_at: new Date()
        };

        console.log('Attempting to save test data:', testData);

        const result = await TypingTestModel.saveTestResult(testData);

        console.log('Test result saved successfully:', result);

        res.status(201).json(result);
    } catch (error) {
        console.error('Error saving test result:', error);
        res.status(500).json({ 
            error: 'Failed to save test result',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// deze functie haalt de test geschiedenis op van een gebruiker
export const getTestHistory = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        
        // controleer of het user ID geldig is
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const history = await TypingTestModel.getHistory(userId);
        res.json(history);
    } catch (error) {
        console.error('Error getting test history:', error);
        res.status(500).json({ error: 'Failed to get test history' });
    }
};

// deze functie haalt de statistieken op van een gebruiker
export const getUserStats = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        
        // controleer of het user ID geldig is
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const stats = await TypingTestModel.getUserStats(userId);
        res.json(stats);
    } catch (error) {
        console.error('Error getting user stats:', error);
        res.status(500).json({ error: 'Failed to get user stats' });
    }
}; 