import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool | null = null;
let isPostgresAvailable = false;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add brief connection timeout so it fails quickly if Postgres isn't running
    connectionTimeoutMillis: 3000,
  });

  // Test the connection
  pool.query('SELECT NOW()')
    .then(() => {
      console.log('Successfully connected to PostgreSQL database.');
      isPostgresAvailable = true;
    })
    .catch((err) => {
      console.warn('⚠️ WARNING: Could not connect to PostgreSQL. Falling back to InMemory storage.');
      console.error(err.message);
      isPostgresAvailable = false;
    });
} else {
  console.warn('⚠️ WARNING: DATABASE_URL not set in env. Falling back to InMemory storage.');
}

export { pool, isPostgresAvailable };

export function checkPostgresStatus(): boolean {
  return isPostgresAvailable;
}
