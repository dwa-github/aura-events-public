// components/Dropdown/Dropdown.jsx
"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import styles from "./Dropdown.module.css"

export default function Dropdown({ title, items }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownRef])

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`${styles.dropdownButton} ${styles.navLinkAppearance}`}
      >
        {title} <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={styles.dropdownItem}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))
          ) : (
            <div className={styles.dropdownItem}>No items</div>
          )}
        </div>
      )}
    </div>
  )
}
