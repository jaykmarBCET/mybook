// db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Accept Neon’s wildcard cert
    },
  },
  logging: false,
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
