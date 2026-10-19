# Pandaday Bookshop — HCI Prototype

Responsive bookshop e-commerce frontend prototype for a human-computer interaction project.

**Portfolio:** [Carl Renz Colico](https://github.com/renzkie8) · **Year:** Year 3

## Methodology

Organize product discovery, localStorage cart state and checkout pages around a responsive bookshop interface.

## Results and limitations

Contains the frontend prototype and supplied HCI documents. Login, payment processing and server-side order persistence are prototype flows rather than verified backend services.

This upload documents the supplied submission. Experiments, model training, graphical interfaces and external services were not fully rerun during portfolio preparation. See VALIDATION.md for checks actually performed.

## Getting started

From this folder run `python -m http.server 8000`, then open http://localhost:8000/index.html. External CDN resources require an internet connection.

## Contents

See [FILES.md](FILES.md) for the file inventory and [DATA.md](DATA.md) for inputs and exclusions. Original documentation, when supplied, follows below. Nonidentical drafts remain identifiable by their original names or a `variant` suffix.

## Provenance and credits

Original comments, team names and reference credits are retained. This repository represents coursework in Carl Renz Colico’s learning portfolio; collaborative or starter code is not claimed as solely individual work.

Source submissions: `HCI-main.zip`

No new blanket license is applied to third-party assets, datasets, course templates or collaborative work. Existing notices remain applicable.

## Topics

html, css, javascript, bootstrap, human-computer-interaction, e-commerce

---

## Original project documentation

# Pandaday Bookshop E-Commerce Project Status

**Date:** May 5, 2026
**Tech Stack:** HTML5, CSS3 (Bootstrap 5), Vanilla JavaScript

This document serves as a status report for the Pandaday Bookshop front-end prototype. It outlines what has been successfully implemented and provides a comprehensive roadmap for the development team on what needs to be connected, fixed, or built next.

---

## ✅ Completed Progress (Front-End Prototype)

### 1. UI & Architecture (Restructured)
- **Organized Directory:** Moved from a flat root to a professional structure:
  - `/assets/`: Centralized CSS, JS, and high-fidelity product images.
  - `/pages/`: Functional sub-pages (Categories, Cart, Profile, etc.).
  - `/pages/checkout/`: Grouped checkout, payment, and confirmation flows.
- **Responsive Base:** A mobile-first design implemented across 16+ pages using Bootstrap 5 and custom theming (`assets/css/styles.css`).
- **Consistent Layouts:** Standardized navigation bars, footers, and mobile bottom navigation across the application.

### 2. Centralized JavaScript Logic (`app.js`)
- **Global State Management:** The cart is fully managed client-side using `localStorage`, ensuring data persists across page reloads.
- **Dynamic Cart Rendering:** The Shopping Cart dynamically reads from the global state to render items, calculate subtotals, and adjust delivery fees.
- **Real-Time UI Updates:** Cart notification badges update instantly across all pages when an action occurs.

### 3. Product Catalog & Search
- **Expanded Database:** A placeholder database of 30 unique products across 6 categories.
- **Live Search & Filtering:** Dynamic search bar and category filters that instantly update the product grid without page reloads.

### 4. Advanced Ordering Flows
- **Reorder Functionality:** Users can instantly push exact items and quantities from past orders into the global cart.
- **Bulk Ordering:** Predefined quantities can be added to the cart directly from the Bulk Orders page.

---

## 🚀 Next Steps, Fixes & Pending Tasks (For the Team)

The prototype currently relies on client-side logic. To move this project into a production-ready state and address current UX/UI gaps, the team must focus on the following tasks:

### 1. UX & Navigation Improvements
- **Back/Forward Navigation:** Implement consistent "Go Back" buttons across all secondary pages, particularly on the **Categories** and **Store Locator** tabs, so users don't get trapped.
- **Responsive Scaling Fixes:** Fix CSS layout issues where content gets cut off or does not resize dynamically when the browser window is stretched on larger desktop monitors. 

### 2. Form Validation & Security (Global)
- **Required Fields Verification:** Implement strict frontend and backend validation for all forms. Currently, forms like the **Request Bulk Quote** can be submitted even if Name, Contact Number, School/Org, and Items Needed are left completely blank. This must be applied globally to all user inputs and checkout flows.

### 3. Account Features & Tabs
- **Create Account Flow:** The system currently only has a "Login with Kaibigan Card" option. A full "Create Account" or "Register" page and button must be added to the authentication flow.
- **Dynamic Edit Profile:** The "Edit Profile" section in the settings is currently static HTML. It needs to be hooked up to allow users to actually update their backend records.
- **Favorites / Likes Tab:** The Wishlist/Favorites feature is static. A dedicated "Favorites" tab needs to be added to the Account or Navigation, and the logic must be wired to save liked products to the user's database profile.
- **Rewards Program:** The Kaibigan Points/Rewards feature needs a dedicated tab and dynamic logic to track and display a user's earned points.

### 4. Backend API & Database Setup
- **Replace Dummy Data:** Swap the hardcoded `app.js` products array with dynamic API `fetch()` calls connecting to a real database (e.g., PostgreSQL, MongoDB).
- **Cart Migration:** Move cart state from `localStorage` to a server-side session/database to sync carts across devices for logged-in users.

### 5. Checkout & Payment Integration
- **Payment Gateway:** Integrate a real payment processor (e.g., Stripe, PayPal, PayMongo, GCash) into the checkout flow.
- **Server-Side Price Checks:** Ensure product prices are strictly verified on the server during checkout to prevent client-side tampering.

### 6. Order Management & Tracking
- **Order History Integration:** Connect `order-history.html` to retrieve real past receipts from the backend.
- **Dynamic Tracking:** Connect the timeline in `order-tracking.html` to a courier API for real-time delivery status.

