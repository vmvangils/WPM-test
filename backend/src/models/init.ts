import { sequelize } from './database';
import { UserModel } from './user';

export const initDatabase = async () => {
    try {
        // Create database if it doesn't exist
        await sequelize.query('CREATE DATABASE IF NOT EXISTS typing_speed_test');
        await sequelize.query('USE typing_speed_test');

        // Sync all models
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}; 