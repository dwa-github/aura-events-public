// /components/Footer/Footer.jsx
import Link from "next/link"
import { Twitter, Linkedin, Facebook, Camera } from "lucide-react"
import styles from "./Footer.module.css"
import { Instagram } from "lucide-react"

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <div className={`${styles.footerColumn} ${styles.footerBranding}`}>
          <h3 className={styles.footerColumnTitle}>Aura Events</h3>
          <p>
            Discover and book amazing events near you. Your next unforgettable
            experience awaits!
          </p>
        </div>

        <div className={`${styles.footerColumn} ${styles.footerNavColumn}`}>
          <h4 className={styles.footerColumnTitle}>Explore</h4>
          <ul className={styles.footerLinkList}>
            <li>
              <Link href="/events" className={styles.footerLink}>
                All Events
              </Link>
            </li>
            <li>
              <Link href="/events/categories" className={styles.footerLink}>
                All Categories
              </Link>
            </li>
            <li>
              <Link href="/events/countries" className={styles.footerLink}>
                Countries
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className={styles.footerLink}>
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div className={`${styles.footerColumn} ${styles.footerNavColumn}`}>
          <h4 className={styles.footerColumnTitle}>Discover</h4>
          <ul className={styles.footerLinkList}>
            <li>
              <Link
                href="/events/cities/amsterdam"
                className={styles.footerLink}
              >
                Featured City
              </Link>
            </li>
            <li>
              <Link
                href="/events/categories/food-drink"
                className={styles.footerLink}
              >
                Popular Category
              </Link>
            </li>
            <li>
              <Link href="#" className={styles.footerLink}>
                Become an Organizer
              </Link>
            </li>
            <li>
              <Link href="#" className={styles.footerLink}>
                Help / FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div className={`${styles.footerColumn} ${styles.footerSocial}`}>
          <h4 className={styles.footerColumnTitle}>Follow Us</h4>
          <div className={styles.socialLinks}>
            <a
              href="#"
              className={styles.socialLink}
              aria-label="Follow us on Twitter"
            >
              <Twitter />
            </a>
            <a
              href="#"
              className={styles.socialLink}
              aria-label="Connect with us on LinkedIn"
            >
              <Linkedin />
            </a>
            <a
              href="#"
              className={styles.socialLink}
              aria-label="Like us on Facebook"
            >
              <Facebook />
            </a>
            <a
              href="#"
              className={styles.socialLink}
              aria-label="Follow us on Instagram"
            >
              <Instagram />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.footerCopyright}>
          © 2024 Aura Events. All rights reserved.
        </p>
        <ul className={styles.footerBottomLinks}>
          <li>
            <Link href="#" className={styles.footerLink}>
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="#" className={styles.footerLink}>
              Terms of Service
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
