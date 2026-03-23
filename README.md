# WanderPath

WanderPath is a location-based exploration platform designed to help users discover nearby places based on proximity and personal interests, rather than popularity or algorithmic bias.

The platform emphasizes authenticity by ensuring that user interactions—especially reviews—are tied to real-world visits through a geospatial verification system.

---

## 🚀 Core Idea

Traditional platforms allow anyone to review any place, leading to spam, fake ratings, and unreliable data.

WanderPath solves this by introducing:

> ✅ **Visit-based verification** — users can only review a place after physically visiting it.

This ensures:
- Authentic reviews
- Higher trust
- Better discovery experience

---

## 🧠 Key Features

- 📍 **Nearby Exploration**
  - Discover places based on real-time location using geospatial queries

- 🗺️ **Map + List View**
  - Flexible browsing experience

- ✅ **Visit Verification System**
  - Reviews are unlocked only after location validation

- ⭐ **Trust-Based Review System**
  - One user → one review per place (after visit)

- 🔖 **Bookmarking**
  - Save places for future exploration

- 👤 **User Activity Tracking**
  - Visit history and engagement

- 🛡️ **Admin Moderation**
  - Control over places, reviews, and user-generated content

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Session-based Authentication

### Core Concepts
- Geospatial indexing (`2dsphere`)
- GeoJSON-based location storage
- Visit-validation logic
- Session management (no JWT)

---

## 🧩 Data Models Overview

- **User** → identity, roles, visited places  
- **Place** → geo-based entity with ratings  
- **Visit** → proof of physical presence  
- **Review** → allowed only after verified visit  
- **Bookmark** → saved places  
- **Session** → authentication layer  
- **Admin** → moderation system  

---

## 🔐 Authentication

WanderPath uses **session-based authentication**:

- Secure HTTP-only cookies
- Server-side session storage
- Session tracking (IP + user agent)
- Easy session invalidation for security

---

## 🌍 Data Strategy

- Base layer: OpenStreetMap (or similar sources)
- Admin-curated places
- User-submitted places (with approval)

---

## 📈 Future Enhancements

- NLP-based search (e.g. “quiet cafes near me”)
- Personalized recommendations
- Social features
- Advanced moderation & trust scoring

---

## 🎯 Vision

WanderPath aims to become a **trust-first exploration platform** where digital reviews are grounded in real-world experiences, reducing noise and increasing reliability in location-based discovery.

---

## ⚙️ Status

🚧 Currently in development — backend architecture and core models implemented.

---

## 📌 Note

This project focuses heavily on backend architecture, scalability, and real-world validation systems rather than just UI.