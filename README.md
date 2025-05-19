# Aura Events - Event Discovery Platform

**Version:** 1.0.0

**Description:** Aura Events is a concept web application designed for discovering, viewing, and managing events. It showcases features like event listings, detailed pages, user dashboards, and event management tools, all built with a modern tech stack.
The site is built with a mobile-first approach, ensuring it works well on all screen sizes, from extra small phones to large desktops, with a focus on fast performance.

This document gives an overview of the app, how it's built, its design ideas, and plans for the future.

**Disclaimer:** This project is a concept version developed for demonstration and learning purposes. The textual content, images, and event data used throughout the application are for visualization purposes only and are not claimed as original or owned by the creators of this project.

## Site Content & Sections Overview

The app has several main pages, each with different parts and things you can click on:

### Homepage (`/`)

- **Header Section:** Prominently displays a highlighted event with its image, title, date, time, location, a primary call-to-action button (e.g., "Book Ticket"), and a secondary "More Info" link to the event's detail page.
- **Categories Section:** Showcases different event categories.
- **Featured Events Section:** Displays a selection of highlighted events.
- **Locations Section:** Highlights cities.
- **About Us & Contact Section:** Provides information about the platform and includes a "Contact Us" button.
- **Footer:** Contains navigation links, social media links, and copyright information.

### All Events Page (`/events`)

- **Event List:** Shows all available events.
- **"Load More" Button:** Lets you see more events.

### Event Detail Page (`/events/your-event-name`)

- **Event Header:** Features the event image, title, date, and location.
- **Event Description Section:** Provides detailed information about the event.
- **Organizer Tools Section:** (Only the event owner can see this) Has "Edit Event" and "Drop Event" buttons.
- **Booking/Interaction Section:** Contains interactive elements like a simulated "Book Ticket" button, "Add to Calendar" download, and a "Share" button.

### All Categories Page (`/events/categories`)

- **Category List:** Displays all available event categories, with links to individual category pages.

### Individual Category Pages (e.g., `/events/categories/music`)

- **Header:** Shows the name of the category.
- **Event List:** Shows events filtered by the specific category.
- **"Load More" Button:** Lets you see more events in that category.

### All Countries Page (`/events/countries`)

- **Country List:** Displays all available countries where events are hosted, with links to individual country pages.

### Individual Country Pages (e.g., `/events/countries/spain`)

- **Event List:** Shows events filtered by that specific country.
- **"Load More" Button:** Lets you see more events in that country.

### Individual City Pages (e.g., `/events/cities/london`)

- **Event List:** Shows events filtered by that specific city.
- **"Load More" Button:** Lets you see more events in that city.

### User Dashboard (`/dashboard`)

- **User Profile/Hero Section:** Displays user information.
- **User Stats Section:** Shows numbers about what the user has done.
- **"My Events" Table Section:** Lists events organized by the user. Each row includes:
  - "Manage" Button (Navigates to the Edit Event page).
  - "Drop" Button (Opens a pop-up to confirm deleting the event).
- **"Team Activity" Table Section:** (Placeholder) Lists events organized by other users.

### Event Management Pages

- **Add Event Page (`/dashboard/add-event`):** Contains the form for creating a new event. Includes Submit and Cancel buttons.
- **Edit Event Page (e.g., `/dashboard/edit-event/your-event-name`):** Contains the form for editing an existing event. Includes Update and Cancel buttons.

## Live Demo

Check out the live version of Aura Events here: [Your Live Demo Link Here](https://events-one-rho.vercel.app)

## Important Notes on Functionality

Please keep the following in mind when exploring Aura Events:

- **Public Event Access:** Anyone can see all listed events.
- **Simulated Interactions:**

  - **Ticket Booking:** Booking a ticket is just a test feature. Visitors can try it out, but no real bookings are made or saved.

  - **User Login:** Logging in is also a test feature. To use features like the dashboard or manage events, go to the `/dashboard` page and pick one of the three sample user profiles. This acts like a login.

- **User Roles & Permissions (Simulated):**
  - There are three sample user profiles you can choose from. They all have the same abilities.
  - After picking a user profile (like logging in), you can see that user's personal dashboard.
  - Only the "logged-in" user can add, edit, or drop events they "own". They can't change events made by other sample users.
- **Data Source:**
  - All event details, categories, locations, and user info come from a cloud database (Vercel Postgres via Neon).

This setup lets you test how the main app works and how user-specific parts behave, all within this example project.

- **Placeholder Pages/Features:** Please note that some pages or features mentioned or implied (e.g., dedicated "Favorites" page, language selection options) may not be fully implemented in this concept version and serve as placeholders for future development.

This means you can try out the main features and see how things work for different users in this sample app.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** JavaScript (JSX)
- **Styling:** CSS Modules
- **Database:** Vercel Postgres (Neon)
  - **Structure:** Employs a logical database schema with relational data modeling, including one-to-many, many-to-one, and many-to-many relationships between entities like events, users, categories, and locations.
- **Icons:** Lucide React (for vector icons)
- **State Management:** React Context
- **Routing:** Next.js App Router
- **Data Fetching:** Native Fetch API
- **Validation:** Client-side
- **Performance & Design:** Built with a mobile-first approach, focusing on fast loading times and a responsive layout that adapts to all screen sizes (extra small, small, medium, large, and extra large).

## Design Philosophy & Creator's Vision

The look and feel of Aura Events came from looking at many different event websites and modern designs. The goal was to mix these ideas to create something new, easy to use, and nice to look at.

**Motivation & Complexity:**
This project was a big step in learning and using new web technologies, especially with Next.js. It's one of the more complex apps I've built, helping me improve my skills in building complete websites, making them work on all screen sizes, and managing how data changes in the app.

**Future Aspirations:**
The plan for Aura Events is to grow it from just an idea into a more complete and professional tool for managing events. The work put into it is aimed at making it a great example for my portfolio, showing I can build complex, useful apps.

The main idea was to make a clean, easy-to-use design that helps people find events easily, and to build it in a way that new features can be added later on.

## Notes for developer

For privacy and security, I don't share access to the main cloud database or where images are stored. If you want to set up the app with sample data using your own database, here’s how:

1.  **Database Connection (`.env.local`):**
    - Make sure you have a PostgreSQL database ready (you can run one on your computer or use a free one online).
    - In the main project folder, create a file named `.env.local`.
    - Add your database connection details to this file like this:
      ```env
      POSTGRES_URL="your_postgresql_connection_string_here"
      ```
2.  **Sample Data (`data/events.json`):**
    - The project includes a sample dataset located at `data/events.json`. This file contains event, category, location, and user data.
    - Image URLs within \`events.json\` typically reference images available within the project repository (e.g., in the \`public/images/\` directory). Ensure these local image paths are correctly set up in your environment if you are serving static assets.
3.  **Data Migration (`app/events/scripts/migrate-data.mjs`):**
    - A migration script is provided at `app/events/scripts/migrate-data.mjs`. This script will create the necessary database tables (if they don't exist), clear any existing data, and then populate the tables using the data from `data/events.json`.
    - To run the script, navigate to the project root in your terminal and execute:
      ```bash
      node app/events/scripts/migrate-data.mjs
      ```
    - Make sure your database is running and the `POSTGRES_URL` in `.env.local` is correctly configured before running the script.

### Testing the "Add Event" Form

- **Test Content:** Sample text and image references for testing the "Add Event" form can be found in the `/test` directory at the root of this project.

- **Accessing the Form:**
  1.  First, simulate a user login by navigating to the `/dashboard` page and selecting one of the user profiles.
  2.  Once on the user's dashboard, the "Add Event" button is located within the "My Events" table section. Clicking this button will open the "Add Event" form.

### Testing Event Management (Edit & Drop)

Once a user is "logged in" (simulated via the `/dashboard` page), they can manage events they own. There are two primary ways to access the management tools:

1.  **From the Event Detail Page:**
    - Navigate to the detail page of an event owned by the currently "logged-in" user (e.g., `/events/your-event-name`).
    - Scroll down the page to find the "Organizer Tools" section.
    - This section contains the "Edit Event" button (navigates to the edit form) and the "Drop Event" button (triggers a confirmation modal).
2.  **From the User Dashboard (`/dashboard`):**
    - Navigate to the dashboard of the "logged-in" user (`/dashboard`).
    - Locate the "My Events" table section.
    - Each row in this table for an event owned by the user includes:
      - A "Manage" button: Clicking this navigates directly to the Edit Event form for that specific event.
      - A "Drop" button: Clicking this triggers a confirmation modal. Confirming in the modal will simulate the deletion of the event from the database.

Remember that event management actions (Edit, Drop) are restricted to events owned by the currently selected user profile.

## Future Development Roadmap

Aura Events is an evolving platform with plans for significant enhancements and new features.

### Version 1.x Series (Near-term Improvements & Refinements)

The focus for the upcoming minor versions (1.1 - 1.9) will be on solidifying the core experience and adding key functionalities:

- **Real User Authentication:** Implement a robust authentication system (e.g., using NextAuth.js) to replace the current simulated login, allowing users to register, log in, and manage their own accounts securely.
- **UI/UX Polish:** Continuous visual refinements across the application for an even cleaner and more intuitive user experience. This includes:
  - Optimizing CSS styles for better performance and maintainability on main pages, subpages, and individual sections.
- **Component Architecture:**
  - Further structuring of components for better organization and reusability.
  - Developing more centralized, reusable components for common UI elements (e.g., advanced cards, banners, form elements).
- **Enhanced Form Handling:** Improve form validation (both client-side and server-side) and user feedback mechanisms.
- **Brand Guidelines Page:** Develop and maintain a page outlining brand assets, design principles, and UI component usage to ensure consistency as the platform scales.
- **User Profile Pages:** Dedicated pages where users can view and manage their profile information.
- **"Favorite" or "Save Event" Functionality:** Allow users to mark events they are interested in.
- **Improved Search & Filtering:** More advanced options for searching and filtering events.
- **Accessibility (a11y) Enhancements:** Ongoing efforts to ensure the platform is accessible to all users.
- **Basic Testing:** Introduction of unit and integration tests for key functionalities.

### Version 2.x Series (Major Features & Platform Evolution)

Looking further ahead, the 2.x versions aim to transform Aura Events into a more comprehensive and professional event management ecosystem:

- **Advanced User Roles & Permissions (Site Management):**
  - Introduce distinct account types for platform administration: Developer, Admin, Site Manager, Member, each with specific capabilities.
  - **Version Tracks Control Page:** Implement an administrative interface for managing different versions of the application, feature flags, or A/B testing tracks.
- **Organization Accounts & Team Management:**
  - Transition individual "organizer" accounts into "Organization Accounts."
  - Organizations can be country-specific or region-specific.
  - Implement roles within an Organization (e.g., Organization Owner, Manager, Event Editor, Agent) with granular permissions for managing events and team members.
- **Advanced Event Management Suite for Organizations:**
  - Ticketing system integration (or built-in).
  - Attendee management and communication tools.
  - Event analytics and reporting.
- **Internationalization (i18n) & Localization (L10n):** Support for multiple languages and regional content.
- **Notification System:** In-app and email notifications for event updates, bookings, reminders, etc.
- **Community Features:** Potentially introduce event reviews, ratings, and discussion forums.
- **API for Integrations:** Develop a public API to allow third-party services to interact with the platform.
- **Enhanced Performance & Scalability:** Further optimizations to handle a larger volume of data and users.

### Version 3.x Series (Native Mobile Expansion)

The 3.x series will focus on extending Aura Events to native mobile platforms, enhancing accessibility and user engagement:

- **Native Mobile Applications:** Develop dedicated iOS and Android applications, potentially using a cross-platform framework like React Native to leverage existing web development skills.
- **API Refinement for Mobile:** Ensure the existing API is robust and optimized for mobile client consumption, or develop specific mobile-first API endpoints.
- **Offline Capabilities:** Explore features that allow users to access certain event information or saved items offline.
- **Push Notifications:** Implement native push notifications for timely updates and reminders.

This roadmap is a living document and will evolve as the project progresses and new ideas emerge.

I welcome your feedback and ideas! If you have suggestions for future features or improvements, please feel free to open an issue or reach out.
