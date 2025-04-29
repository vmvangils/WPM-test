import { Request, Response } from 'express';
import { UserModel } from '../models/user';

// deze functie handelt de registratie van een nieuwe gebruiker af
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        console.log('Registration attempt:', { username, email });

        // controleer of alle velden zijn ingevuld
        if (!username || !email || !password) {
            console.log('Missing fields:', { username, email, password });
            return res.status(400).json({ error: 'All fields are required' });
        }

        // controleer of het emailadres al bestaat
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            console.log('Email already exists:', email);
            return res.status(400).json({ error: 'Email already registered' });
        }

        // maak een nieuwe gebruiker aan
        const user = await UserModel.createUser(username, email, password);
        if (!user) {
            console.log('Failed to create user');
            return res.status(500).json({ error: 'Failed to create user' });
        }

        // sla de gebruiker op in de session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        console.log('User created successfully:', user.id);
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error details:', error);
        res.status(500).json({ 
            error: 'Failed to register user',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// deze functie handelt het inloggen van een gebruiker af
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // controleer of email en wachtwoord zijn ingevuld
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // controleer of de inloggegevens correct zijn
        const user = await UserModel.verifyUser(email, password);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // sla de gebruiker op in de session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

// deze functie handelt het uitloggen van een gebruiker af
export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ message: 'Logout successful' });
    });
};

// deze functie controleert of een gebruiker is ingelogd
export const checkAuth = (req: Request, res: Response) => {
    if (req.session.user) {
        res.json({ 
            isAuthenticated: true,
            user: req.session.user 
        });
    } else {
        res.status(401).json({ 
            isAuthenticated: false,
            message: 'Not authenticated' 
        });
    }
}; 