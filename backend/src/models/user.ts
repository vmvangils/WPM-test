import { db as pool } from '../database';

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;
}

export class UserModel {
    static async createUser(username: string, email: string, password: string): Promise<User | null> {
        try {
            console.log('Creating user in database:', { username, email });
            const [result] = await pool.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, password]
            );
            console.log('User created in database, getting user by ID');
            return this.getUserById((result as any).insertId);
        } catch (error) {
            console.error('Error in createUser:', error);
            return null;
        }
    }

    static async getUserById(id: number): Promise<User | null> {
        try {
            const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
            const user = (rows as User[])[0];
            if (!user) {
                console.log('No user found with ID:', id);
            }
            return user || null;
        } catch (error) {
            console.error('Error in getUserById:', error);
            return null;
        }
    }

    static async getUserByEmail(email: string): Promise<User | null> {
        try {
            const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
            const user = (rows as User[])[0];
            if (!user) {
                console.log('No user found with email:', email);
            }
            return user || null;
        } catch (error) {
            console.error('Error in getUserByEmail:', error);
            return null;
        }
    }

    static async verifyUser(email: string, password: string): Promise<User | null> {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM users WHERE email = ? AND password = ?',
                [email, password]
            );
            const user = (rows as User[])[0];
            if (!user) {
                console.log('Invalid credentials for email:', email);
            }
            return user || null;
        } catch (error) {
            console.error('Error in verifyUser:', error);
            return null;
        }
    }
} 