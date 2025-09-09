import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://ubo7vdjpbj79om:pd540ac8b8b1909ce7e454cce0187c4b7765fc97f2e6d6a3b5137cf7e736a61b6@co8c1665c0p5k.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d6j18j0i23385f'
});


// Create a new user
async function createUser(user_id, password) {
  console.log('saved to db');

  const result = await pool.query(
    'INSERT INTO userdb (user_id, password) VALUES ($1, $2)',
    [user_id, password]
  );

  return result.rows[0];
}

async function createUnipileEntry(user_id, account_id, provider) {
  const result = await pool.query(
    'INSERT INTO unipiledb (user_id, account_id, provider) VALUES ($1, $2, $3)',
    [user_id, account_id, provider]
  );
  return result.rows[0];
}


async function getPasswordByUserId(user_id) {
  const result = await pool.query(
    'SELECT password FROM userdb WHERE user_id = $1',
    [user_id]
  );
  return result.rows[0];
}

// Get user by username
async function getAccountByUserId(user_id) {
  const result = await pool.query(
    'SELECT user_id, account_id, provider FROM unipiledb WHERE user_id = $1',
    [user_id]
  );
  return result.rows;
}


async function accountExists( account_id) {
    const result = await pool.query(
        'SELECT account_id FROM unipiledb WHERE account_id = $1',
        [account_id]
    );
    console.log(result);
    return result.rowCount > 0;
}


export { createUser, createUnipileEntry, getPasswordByUserId, getAccountByUserId, accountExists };