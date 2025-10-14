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

// const  sequelize = new Sequelize({
//   host:process.env.DATABASE_HOST,
//   port:process.env.DATABASE_PORT,
//   database:process.env.DATABASE_NAME,
//   password:process.env.POSTGRES_PASSWORD,
//   dialect:"postgres",
//   username:process.env.POSTGRES_USER

// }) 
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Connected to Neon PostgreSQL successfully');
  })
  .catch((error) => {
    console.error('❌ Unable to connect to Neon PostgreSQL:', error);
  });

export default sequelize;
