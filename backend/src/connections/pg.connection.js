import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// You can set this in your .env file as SQLITE_DB=./database.sqlite
const sqliteDbPath = process.env.SQLITE_DB || './database.sqlite';

// Create a Sequelize instance for SQLite
const sequelize = new Sequelize({
  host:process.env.DATABASE_HOST,
  port:process.env.DATABASE_PORT,
  dialect:process.env.DATABASE_SERVICE,
  database:process.env.DATABASE_NAME,
  password:process.env.POSTGRES_PASSWORD,
  username:process.env.POSTGRES_USER
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
