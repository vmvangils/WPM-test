import { db as pool } from '../database';
import { db } from '../database';

export interface TypingTest {
    id: number;
    user_id: number;
    wpm: number;
    accuracy: number;
    test_duration: number;
    created_at: Date;
}

export interface LeaderboardEntry {
    username: string;
    highest_wpm: number;
    average_wpm: number;
    total_tests: number;
}

export class TypingTestModel {
    static async saveTest(userId: number, wpm: number, accuracy: number, test_duration: number): Promise<TypingTest> {
        const [result] = await pool.execute(
            'INSERT INTO typing_tests (user_id, wpm, accuracy, test_duration) VALUES (?, ?, ?, ?)',
            [userId, wpm, accuracy, test_duration]
        );
        
        const [rows] = await pool.execute(
            'SELECT * FROM typing_tests WHERE id = ?',
            [(result as any).insertId]
        );
        
        return (rows as TypingTest[])[0];
    }

    static async getHistory(userId: number): Promise<TypingTest[]> {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM typing_tests WHERE user_id = ? ORDER BY created_at DESC',
                [userId]
            ) as [TypingTest[], any];

            return rows;
        } catch (error) {
            console.error('Error in getHistory:', error);
            throw error;
        }
    }

    static async getUserStats(userId: number): Promise<{
        total_tests: number;
        average_wpm: number;
        highest_wpm: number;
        average_accuracy: number;
    }> {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    COUNT(*) as total_tests,
                    COALESCE(AVG(wpm), 0) as average_wpm,
                    COALESCE(MAX(wpm), 0) as highest_wpm,
                    COALESCE(AVG(accuracy), 0) as average_accuracy
                FROM typing_tests 
                WHERE user_id = ?
            `, [userId]) as [any[], any];

            return {
                total_tests: Number(rows[0].total_tests) || 0,
                average_wpm: Number(rows[0].average_wpm) || 0,
                highest_wpm: Number(rows[0].highest_wpm) || 0,
                average_accuracy: Number(rows[0].average_accuracy) || 0
            };
        } catch (error) {
            console.error('Error in getUserStats:', error);
            throw error;
        }
    }

    static async getLeaderboard(): Promise<LeaderboardEntry[]> {
        const [rows] = await pool.execute(`
            SELECT 
                u.username,
                MAX(t.wpm) as highest_wpm,
                AVG(t.wpm) as average_wpm,
                COUNT(t.id) as total_tests
            FROM users u
            LEFT JOIN typing_tests t ON u.id = t.user_id
            GROUP BY u.id, u.username
            ORDER BY highest_wpm DESC
            LIMIT 10
        `);
        return rows as LeaderboardEntry[];
    }

    static async saveTestResult(test: Omit<TypingTest, 'id'>): Promise<TypingTest> {
        try {
            console.log('Model received test data:', test);

            // Ensure all numeric values are properly typed
            const typedTest = {
                user_id: Number(test.user_id),
                wpm: Number(test.wpm),
                accuracy: Number(test.accuracy),
                test_duration: Number(test.test_duration),
                created_at: test.created_at
            };

            console.log('Typed test data:', typedTest);

            const [result] = await pool.query(
                'INSERT INTO typing_tests (user_id, wpm, accuracy, test_duration, created_at) VALUES (?, ?, ?, ?, ?)',
                [typedTest.user_id, typedTest.wpm, typedTest.accuracy, typedTest.test_duration, typedTest.created_at]
            ) as [any, any];

            console.log('Database insert result:', result);

            if (!result.insertId) {
                throw new Error('Failed to get insert ID from database');
            }

            const newTest: TypingTest = {
                id: result.insertId,
                ...typedTest
            };

            console.log('Created new test record:', newTest);

            return newTest;
        } catch (error) {
            console.error('Error in saveTestResult:', error);
            throw error;
        }
    }
} 