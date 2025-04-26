import pkg from 'pg';
const { Client } = pkg;
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DATABASE_NAME;

async function createDatabase() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
  });

  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname='${dbName}'`
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created`);
    } else {
      console.log(`ℹ️ Database "${dbName}" already exists`);
    }
  } catch (err) {
    console.error('❌ Error creating database:', err);
  } finally {
    await client.end();
  }
}

await createDatabase();

const sequelize = new Sequelize(
  dbName,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Sequelize connected to database');
  })
  .catch((error) => {
    console.error('❌ Sequelize connection failed:', error);
  });

export default sequelize;
