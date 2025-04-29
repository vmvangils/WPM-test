import { Router } from 'express';
import { saveTestResult, getTestHistory, getUserStats, getLeaderboard } from '../controllers/typingTestController';

const router = Router();

router.post('/save', saveTestResult);
router.get('/history/:userId', getTestHistory);
router.get('/stats/:userId', getUserStats);
router.get('/leaderboard', getLeaderboard);

export default router; 