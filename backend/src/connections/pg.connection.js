import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// You can set this in your .env file as SQLITE_DB=./database.sqlite
const sqliteDbPath = process.env.SQLITE_DB || './database.sqlite';

// Create a Sequelize instance for SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: sqliteDbPath,
  logging: false, // Set to true if you want to see SQL logs
});

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Sequelize connected to SQLite database');
  })
  .catch((error) => {
    console.error('❌ Sequelize connection to SQLite failed:', error);
  });

export default sequelize;
