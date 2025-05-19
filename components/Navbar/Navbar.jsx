// components/Navbar/Navbar.jsx
"use client"

import React, { useState, useEffect, useRef, useContext } from "react"
import Link from "next/link"
import Image from "next/image"
import styles from "./Navbar.module.css"
import EventCategoriesDropdown from "../EventCategoriesDropdown/EventCategoriesDropdown"
import CitiesDropdown from "../CitiesDropdown/CitiesDropdown"
import { FaSearch, FaHeart, FaGlobe, FaBars, FaTimes } from "react-icons/fa"
import {
  MdDashboard,
  MdComputer,
  MdOutlineWbSunny,
  MdOutlineModeNight,
  MdOutlineSettingsBrightness,
} from "react-icons/md"
import {
  LuLogOut,
  LuLayoutDashboard,
  LuChevronRight,
  LuChevronDown,
} from "react-icons/lu"
import { UserCircle2 as LuUserCircle2 } from "lucide-react"
import { AiOutlineLoading } from "react-icons/ai"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import UserContext from "@/context/UserContext"

const DropdownItem = ({
  itemKey,
  href,
  onClick,
  children,
  icon: Icon,
  userImage,
  userNameForAlt,
  isActive,
  role,
  ariaChecked,
}) => {
  const content = (
    <>
      {Icon && <Icon size={18} className={styles.dropdownItemIcon} />}
      {userImage && (
        <Image
          src={userImage}
          alt={userNameForAlt ? `Profile of ${userNameForAlt}` : ""}
          width={22}
          height={22}
          className={styles.dropdownUserImage}
        />
      )}
      <span className={styles.dropdownItemText}>{children}</span>
    </>
  )

  const itemClassName = `${styles.dropdownItem} ${
    isActive ? styles.active : ""
  }`

  if (href) {
    return (
      <Link
        key={itemKey}
        href={href}
        className={itemClassName}
        onClick={onClick}
        role={role || "menuitem"}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      key={itemKey}
      className={itemClassName}
      onClick={onClick}
      role={role || "menuitem"}
      aria-checked={ariaChecked}
    >
      {content}
    </button>
  )
}

const MobileMenuPlaceholder = ({
  closeMenu,
  categories = [],
  cities = [],
  handleThemeChange,
  themeAriaLabel,
  ThemeIcon,
  resolvedTheme,
  mobileSearchFormProps,
  mobileSearchInputProps,
  isSubmittingSearch,
}) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isCitiesOpen, setIsCitiesOpen] = useState(false)

  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen)
  const toggleCities = () => setIsCitiesOpen(!isCitiesOpen)

  return (
    <div className={styles.mobileMenuOverlay} onClick={closeMenu}>
      <div
        className={styles.mobileMenuContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.mobileMenuCloseButton}
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <FaTimes />
        </button>
        <form
          className={styles.mobileSearchContainer}
          {...mobileSearchFormProps}
        >
          <input
            type="text"
            placeholder="Search events, categories, locations..."
            className={styles.searchInput}
            {...mobileSearchInputProps}
          />
          <button
            type="submit"
            className={styles.searchButton}
            aria-label="Search"
            disabled={isSubmittingSearch}
          >
            {isSubmittingSearch ? (
              <AiOutlineLoading className={styles.spinner} />
            ) : (
              <FaSearch />
            )}
          </button>
        </form>
        <nav className={styles.mobileNavSection}>
          <Link
            href="/events"
            className={styles.mobileNavLink}
            onClick={closeMenu}
          >
            All Events
          </Link>
        </nav>

        <nav className={styles.mobileNavSection}>
          <button
            className={styles.mobileNavCollapsibleHeading}
            onClick={toggleCategories}
            aria-expanded={isCategoriesOpen}
          >
            Categories
            <LuChevronRight
              className={`${styles.mobileNavChevron} ${
                isCategoriesOpen ? styles.chevronOpen : ""
              }`}
            />
          </button>
          {isCategoriesOpen && (
            <div className={styles.mobileNavSubList}>
              <Link
                href="/events/categories"
                className={styles.mobileNavLink}
                onClick={closeMenu}
              >
                All Categories
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/events/categories/${cat.slug}`}
                  className={styles.mobileNavLink}
                  onClick={closeMenu}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </nav>

        <nav className={styles.mobileNavSection}>
          <button
            className={styles.mobileNavCollapsibleHeading}
            onClick={toggleCities}
            aria-expanded={isCitiesOpen}
          >
            Cities
            <LuChevronRight
              className={`${styles.mobileNavChevron} ${
                isCitiesOpen ? styles.chevronOpen : ""
              }`}
            />
          </button>
          {isCitiesOpen && (
            <div className={styles.mobileNavSubList}>
              <Link
                href="/events/cities"
                className={styles.mobileNavLink}
                onClick={closeMenu}
              >
                All Cities
              </Link>
              {cities
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((city) => (
                  <Link
                    key={city.id}
                    href={`/events/cities/${
                      city.name
                        ? city.name.toLowerCase().replace(/\s+/g, "-")
                        : city.id
                    }`}
                    className={styles.mobileNavLink}
                    onClick={closeMenu}
                  >
                    {city.name}
                  </Link>
                ))}
            </div>
          )}
        </nav>

        <div className={styles.mobileActionButtons}>
          <button className={styles.iconButtonOnly} aria-label="Wishlist">
            <FaHeart />
          </button>
          <button className={styles.iconButtonOnly} aria-label="Language">
            <FaGlobe />
          </button>
          <button
            className={styles.iconButtonOnly}
            onClick={() => {
              const nextTheme = resolvedTheme === "light" ? "dark" : "light"
              handleThemeChange(nextTheme)
            }}
            aria-label={themeAriaLabel}
          >
            <ThemeIcon />
          </button>
          <Link
            href="/dashboard"
            className={styles.actionButton}
            onClick={closeMenu}
          >
            <MdDashboard />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

const Navbar = ({ users = [], categories = [], cities = [] }) => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { currentUser, loginUser, logoutUser } = useContext(UserContext)
  const router = useRouter()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmittingSearch, setIsSubmittingSearch] = useState(false)

  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const navbarRef = useRef(null)

  const userDropdownRef = useRef(null)
  const userButtonRef = useRef(null)
  const themeDropdownRef = useRef(null)
  const themeButtonRef = useRef(null)

  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1200)
    checkDesktop()
    window.addEventListener("resize", checkDesktop)
    return () => window.removeEventListener("resize", checkDesktop)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const navbarHeight = navbarRef.current?.offsetHeight || 70
      if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > navbarHeight
      ) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
        setIsVisible(true)
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  useEffect(() => {
    closeMobileMenu()
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
      document.body.classList.add("mobile-menu-is-open")
    } else {
      document.body.style.overflow = ""
      document.body.classList.remove("mobile-menu-is-open")
    }
    return () => {
      document.body.style.overflow = ""
      document.body.classList.remove("mobile-menu-is-open")
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isThemeDropdownOpen &&
        themeButtonRef.current &&
        !themeButtonRef.current.contains(event.target) &&
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target)
      ) {
        setIsThemeDropdownOpen(false)
      }
      if (
        isUserDropdownOpen &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target) &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isThemeDropdownOpen, isUserDropdownOpen])

  const toggleUserDropdown = () => {
    setIsThemeDropdownOpen(false)
    setIsUserDropdownOpen((prev) => !prev)
  }

  const toggleThemeDropdown = () => {
    setIsUserDropdownOpen(false)
    setIsThemeDropdownOpen((prev) => !prev)
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setIsThemeDropdownOpen(false)
  }

  const handleSearchInputChange = (event) => setSearchQuery(event.target.value)

  const handleSearchSubmit = async (event) => {
    event.preventDefault()
    const trimmedQuery = searchQuery.trim()

    if (!trimmedQuery || isSubmittingSearch) {
      return
    }

    setIsSubmittingSearch(true)
    try {
      await router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)
      setSearchQuery("")
      if (isMobileMenuOpen) {
        closeMobileMenu()
      }
    } catch (error) {
      console.error(
        "Failed to navigate to search page. Error message:",
        error.message,
        "Full error:",
        error
      )
    } finally {
      setIsSubmittingSearch(false)
    }
  }

  const handleUserLoginSelect = (selectedUser) => {
    if (selectedUser) {
      loginUser(selectedUser)
      router.push(`/dashboard/${selectedUser.slug}`)
    }
    setIsUserDropdownOpen(false)
  }

  const handleUserLogout = () => {
    logoutUser()
    router.push("/")
    setIsUserDropdownOpen(false)
  }

  const ThemeIcon = () => {
    if (!hasMounted) return <MdOutlineSettingsBrightness aria-hidden="true" />
    switch (resolvedTheme) {
      case "dark":
        return <MdOutlineModeNight aria-hidden="true" />
      case "light":
        return <MdOutlineWbSunny aria-hidden="true" />
      default:
        return <MdOutlineSettingsBrightness aria-hidden="true" />
    }
  }

  const themeAriaLabel = hasMounted
    ? `Change theme. Current theme: ${resolvedTheme || "system"}`
    : "Change theme"

  return (
    <nav
      ref={navbarRef}
      className={`${styles.navbar} ${!isVisible ? styles.navbarHidden : ""}`}
    >
      <div className={styles.navbarInner}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
            AuraEvents
          </Link>
          <div className={styles.desktopNav}>
            <Link href="/events" className={styles.desktopNavLink}>
              Events
            </Link>
            <EventCategoriesDropdown categories={categories} />
            <CitiesDropdown cities={cities} />
          </div>
        </div>

        <div className={styles.center}>
          {isDesktop && (
            <form
              className={styles.searchContainer}
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search events, artists, cities..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                disabled={isSubmittingSearch}
              />
              <button
                type="submit"
                className={styles.searchButton}
                aria-label="Search"
                disabled={isSubmittingSearch}
              >
                {isSubmittingSearch ? (
                  <AiOutlineLoading className={styles.spinner} />
                ) : (
                  <FaSearch />
                )}
              </button>
            </form>
          )}
        </div>

        <div className={styles.right}>
          <div className={styles.desktopActions}>
            <button className={styles.iconButtonOnly} aria-label="Wishlist">
              <FaHeart />
            </button>
            <button className={styles.iconButtonOnly} aria-label="Language">
              <FaGlobe />
            </button>

            <div className={styles.dropdownContainer} ref={themeButtonRef}>
              <button
                className={styles.iconButtonOnly}
                onClick={toggleThemeDropdown}
                aria-haspopup="true"
                aria-expanded={isThemeDropdownOpen}
                aria-label={themeAriaLabel}
                aria-controls="theme-menu"
              >
                <ThemeIcon />
              </button>
              {isThemeDropdownOpen && (
                <div
                  id="theme-menu"
                  className={styles.dropdownMenu}
                  ref={themeDropdownRef}
                  role="menu"
                >
                  <DropdownItem
                    itemKey="theme-light"
                    onClick={() => handleThemeChange("light")}
                    icon={MdOutlineWbSunny}
                    isActive={theme === "light"}
                    role="menuitemradio"
                    ariaChecked={theme === "light"}
                  >
                    Light
                  </DropdownItem>
                  <DropdownItem
                    itemKey="theme-dark"
                    onClick={() => handleThemeChange("dark")}
                    icon={MdOutlineModeNight}
                    isActive={theme === "dark"}
                    role="menuitemradio"
                    ariaChecked={theme === "dark"}
                  >
                    Dark
                  </DropdownItem>
                  <DropdownItem
                    itemKey="theme-system"
                    onClick={() => handleThemeChange("system")}
                    icon={MdComputer}
                    isActive={theme === "system"}
                    role="menuitemradio"
                    ariaChecked={theme === "system"}
                  >
                    System
                  </DropdownItem>
                </div>
              )}
            </div>

            <div className={styles.dropdownContainer} ref={userButtonRef}>
              {hasMounted && currentUser ? (
                <>
                  <button
                    className={styles.userProfileButton}
                    onClick={toggleUserDropdown}
                    aria-haspopup="true"
                    aria-expanded={isUserDropdownOpen}
                    aria-label={`User menu for ${currentUser.name}`}
                    aria-controls="user-menu"
                  >
                    {currentUser.avatarUrl ? (
                      <Image
                        src={currentUser.avatarUrl}
                        alt=""
                        width={30}
                        height={30}
                        className={styles.navbarUserImage}
                      />
                    ) : (
                      <LuUserCircle2
                        size={30}
                        className={styles.navbarUserIconFallback}
                      />
                    )}
                    <span className={styles.navbarUserName}>
                      {currentUser.name}
                    </span>
                    <LuChevronDown
                      size={18}
                      className={`${styles.chevronIcon} ${
                        isUserDropdownOpen ? styles.chevronOpen : ""
                      }`}
                    />
                  </button>
                  {isUserDropdownOpen && (
                    <div
                      id="user-menu"
                      className={styles.dropdownMenu}
                      ref={userDropdownRef}
                      role="menu"
                    >
                      <DropdownItem
                        itemKey="my-dashboard"
                        href={`/dashboard/${currentUser.slug}`}
                        onClick={() => setIsUserDropdownOpen(false)}
                        icon={LuLayoutDashboard}
                      >
                        My Dashboard
                      </DropdownItem>
                      <DropdownItem
                        itemKey="logout"
                        onClick={handleUserLogout}
                        icon={LuLogOut}
                      >
                        Logout
                      </DropdownItem>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    className={styles.actionButton}
                    onClick={toggleUserDropdown}
                    aria-haspopup="true"
                    aria-expanded={isUserDropdownOpen}
                    aria-label="Select user to login"
                    aria-controls="user-menu"
                  >
                    <MdDashboard aria-hidden="true" />
                    <span>Dashboard</span>
                    <LuChevronDown
                      size={18}
                      className={`${styles.chevronIcon} ${
                        isUserDropdownOpen ? styles.chevronOpen : ""
                      }`}
                    />
                  </button>
                  {isUserDropdownOpen && (
                    <div
                      id="user-menu"
                      className={styles.dropdownMenu}
                      ref={userDropdownRef}
                      role="menu"
                    >
                      {users?.length > 0 ? (
                        users.map((user) => (
                          <DropdownItem
                            key={user.id}
                            itemKey={user.id}
                            onClick={() => handleUserLoginSelect(user)}
                            userImage={user.avatarUrl}
                            userNameForAlt={user.name}
                          >
                            {user.name}
                          </DropdownItem>
                        ))
                      ) : (
                        <div
                          className={styles.dropdownItem}
                          role="menuitem"
                          aria-disabled="true"
                        >
                          No users available
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <button
            className={styles.mobileMenuButton}
            onClick={handleToggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <MobileMenuPlaceholder
          id="mobile-menu"
          closeMenu={closeMobileMenu}
          categories={categories}
          cities={cities}
          handleThemeChange={handleThemeChange}
          themeAriaLabel={themeAriaLabel}
          ThemeIcon={ThemeIcon}
          resolvedTheme={resolvedTheme}
          mobileSearchFormProps={{ onSubmit: handleSearchSubmit }}
          mobileSearchInputProps={{
            value: searchQuery,
            onChange: handleSearchInputChange,
            disabled: isSubmittingSearch,
          }}
          isSubmittingSearch={isSubmittingSearch}
        />
      )}
    </nav>
  )
}

export default Navbar
