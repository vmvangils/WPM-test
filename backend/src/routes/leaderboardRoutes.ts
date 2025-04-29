import { Router } from 'express';
import { submitScore, getTopScores } from '../controllers/leaderboardController';

const router = Router();

router.post('/submit', submitScore);
router.get('/top', getTopScores);

export const leaderboardRoutes = router; 