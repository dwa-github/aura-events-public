// context/UserContext.js
"use client"
import { createContext } from "react"

const UserContext = createContext({
  currentUser: null,
  loginUser: (userData) => {},
  logoutUser: () => {},
})

export default UserContext
