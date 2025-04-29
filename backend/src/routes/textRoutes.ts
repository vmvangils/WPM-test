import { Router } from 'express';
import { getRandomText } from '../controllers/textController';

const router = Router();

router.get('/random', getRandomText);

export const textRoutes = router; 