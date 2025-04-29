import { Router } from 'express';
import { register, login, logout, checkAuth } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check', checkAuth);

export default router; 