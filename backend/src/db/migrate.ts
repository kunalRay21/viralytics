import { pool, isPostgresAvailable } from './pool';

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  duration NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  vpi NUMERIC NOT NULL,
  classification TEXT NOT NULL,
  analysis_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

async function migrate() {
  console.log('Running database migrations...');
  if (!isPostgresAvailable || !pool) {
    console.warn('⚠️ Postgres is not available. Skipping migrations (running in InMemory mode).');
    process.exit(0);
  }

  try {
    await pool.query(schema);
    console.log('✅ Migrations completed successfully.');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
