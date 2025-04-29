import express, { Express } from 'express';
import cors from 'cors';
import session, { SessionOptions } from 'express-session';
import { leaderboardRoutes } from './routes/leaderboardRoutes';
import { textRoutes } from './routes/textRoutes';
import authRoutes from './routes/authRoutes';
import typingTestRoutes from './routes/typingTestRoutes';
import { sequelize } from './models/database';
import SequelizeStore from 'connect-session-sequelize';
import { initDatabase } from './models/init';

// dit maakt een nieuwe session store aan met SQL
const SequelizeSessionStore = SequelizeStore(session.Store);

// dit declareert de session data interface
declare module 'express-session' {
    interface SessionData {
        user?: {
            id: number;
            username: string;
            email: string;
        };
    }
}

// dit initialiseert de Express applicatie
const app: Express = express();
const port = process.env.PORT || 5000;

// dit initialiseert de database
initDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

// dit is de configuratie voor de session
const sessionConfig: SessionOptions = {
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeSessionStore({
        db: sequelize,
        tableName: 'sessions',
        checkExpirationInterval: 15 * 60 * 1000, // Check expired sessions every 15 minutes
        expiration: 24 * 60 * 60 * 1000 // Session expires in 24 hours
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    }
};

// dit is de CORS configuratie
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// dit voegt middleware toe voor JSON parsing en session handling
app.use(express.json());
app.use(session(sessionConfig));

// dit voegt alle routes toe aan de applicatie
app.use('/api/auth', authRoutes);
app.use('/api/typing', typingTestRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/text', textRoutes);



// dit start de server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

