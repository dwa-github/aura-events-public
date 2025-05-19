// lib/getUsers.js
import { query } from "./db"
import { transformRows } from "./utils"

export async function getUsers() {
  try {
    const usersRes = await query("SELECT * FROM users ORDER BY name ASC")
    const users = transformRows(usersRes.rows)
    return users
  } catch (error) {
    console.error("[getUsers] Error fetching users from database:", error)
    return []
  }
}
