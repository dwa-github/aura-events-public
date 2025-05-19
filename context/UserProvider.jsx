// context/UserProvider.jsx
"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react"
import UserContext from "./UserContext"

const USER_STORAGE_KEY = "eventAppCurrentUser"

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      try {
        return storedUser ? JSON.parse(storedUser) : null
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem(USER_STORAGE_KEY)
        return null
      }
    }
    return null
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
      } else {
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    }
  }, [currentUser])

  const loginUser = useCallback((userData) => {
    setCurrentUser(userData)
  }, [])

  const logoutUser = useCallback(() => {
    setCurrentUser(null)
  }, [])

  const contextValue = useMemo(
    () => ({
      currentUser,
      loginUser,
      logoutUser,
    }),
    [currentUser, loginUser, logoutUser]
  )

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}
