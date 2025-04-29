import { Sequelize } from 'sequelize';
// sequelize is a library for connecting to the database
// database connection
export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'typing_speed_test',
    logging: false
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    }); 