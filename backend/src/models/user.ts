import { db as pool } from '../database';

// user model
export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;
}

export class UserModel {
    // creates a new user in the database
    // <User | null> means that the function will return a User or nothing if there is an error
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
    // gets a user by their id
    // async means that it can finish later incase more needed things have to be done first.
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
            // gets a user by their email, pool is the database connection
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
            // (rows as User[]) means that the User row already exists, so we can use it, so that typescript doesn't complain.
            const user = (rows as User[])[0];
            if (!user) {
                console.log('Invalid credentials for email:', email);
            }
            // the || means that if the user is not found, return an error using the console.error.
            return user || null;
        } catch (error) {
            console.error('Error in verifyUser:', error);
            return null;
        }
    }
} 