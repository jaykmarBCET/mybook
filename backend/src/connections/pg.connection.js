import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Neon DB connection using DATABASE_URL (full URL provided by Neon)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
  logging: false, // optional: disable SQL query logging
});

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Connected to Neon PostgreSQL successfully');
  })
  .catch((error) => {
    console.error('❌ Unable to connect to Neon PostgreSQL:', error);
  });

export default sequelize;
