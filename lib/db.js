// lib/db.js
import { Pool } from "pg"

let pool

export function getPool() {
  if (!pool) {
    if (!process.env.POSTGRES_URL) {
      throw new Error("POSTGRES_URL environment variable is not set.")
    }
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    })
  }
  return pool
}

export async function query(text, params) {
  const client = await getPool().connect()
  try {
    const res = await client.query(text, params)
    return res
  } finally {
    client.release()
  }
}
