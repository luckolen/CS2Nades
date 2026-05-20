# CS2 Tactical Utility Hub

A lightweight, high-performance web application designed to track and filter Counter-Strike 2 grenade lineups. Built for speed mid-match.

🌐 **Live Demo:** [csnades.kolen.xyz](https://csnades.kolen.xyz)

## 🚀 Key Features

* **Filtering System:** Dynamically filter utility arrays by **Side** (T or CT), **Type** (Smoke, Molotov, Flash, HE), and **Tactical Priority** (Core Must-Knows vs. Situational lineups).
* **Center-Focus Lightbox Zoom:** Automated image detection scales aim/crosshair reference images to **150% zoom** expanding outwards from the absolute center point, keeping lines perfectly aligned on-screen.
* **Anchor Deep-Linking:** Click any grenade title to update your URL hash to generate shareable deep-links directly targeting a specific piece of utility.

## 📂 Project Directory Map

```text
.
├── html/
│   ├── index.html          # Global Map Selector Dashboard
│   ├── 404.html            # Dark-theme contextual error screen
│   ├── css/
│   │   └── global.css      # Core grid layout, faction states, & zoom engine
│   ├── data/
│   │   ├── cache.json      # Lineup dataset for de_cache
│   │   └── mirage.json     # Lineup dataset for de_mirage
│   ├── js/
│   │   └── app.js          # Dynamic DOM building & filter evaluation engine
│   ├── maps/
│   │   └── index.html      # The dynamic presentation shell webpage
│   └── media/              # Map-specific step-by-step imagery
└── nginx.conf              # Project-level Nginx server and routing configurations
