# WP React Admin

[![WordPress](https://img.shields.io/badge/WordPress-6.4%2B-blue.svg)](https://wordpress.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![PHP](https://img.shields.io/badge/PHP-8.1%2B-777BB4.svg)](https://php.net/)
[![CI](https://github.com/midasmoradi/wp-react-admin/actions/workflows/ci.yml/badge.svg)](https://github.com/midasmoradi/wp-react-admin/actions/workflows/ci.yml)

Custom WordPress admin dashboard built with **React** and **WP REST API** — demonstrates modern Gutenberg-era frontend skills while keeping WordPress as the core platform.

> **Author:** [Midas Moradi](https://github.com/midasmoradi)

## Features

| Feature | Description |
|---------|-------------|
| **Custom Dashboard** | Full React SPA inside WP admin |
| **Analytics Widgets** | Posts, users, comments, media stats |
| **React Components** | StatCard, AnalyticsChart, ActivityFeed, RecentPosts |
| **WP REST API** | Custom `wpra/v1` endpoints + `@wordpress/api-fetch` |
| **OOP PHP Backend** | PSR-4, service container, security layer |

## Screenshots

After activation, visit **React Dashboard** in the admin menu.

## Architecture

```
PHP (src/)                    React (assets/src/)
├── Api/                      ├── components/
│   ├── AnalyticsRestController   ├── Dashboard.jsx
│   └── PostsRestController       ├── StatCard.jsx
├── Admin/DashboardRegistrar      ├── AnalyticsChart.jsx
└── Container/                    └── api/client.js
```

## Requirements

- WordPress 6.4+
- PHP 8.1+
- Node.js 18+ (for building assets)
- Composer

## Installation

```bash
git clone https://github.com/midasmoradi/wp-react-admin.git
cd wp-react-admin
composer install --no-dev
```

The `build/` folder is included — no npm build required to run.

Activate the plugin. Open **React Dashboard** from the admin sidebar.

## Development

```bash
npm start          # Hot reload during development
npm run build      # Production build → build/
composer phpcs     # PHP standards
```

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wp-json/wpra/v1/analytics/overview` | Site stats overview |
| GET | `/wp-json/wpra/v1/analytics/posts-chart` | Posts per month |
| GET | `/wp-json/wpra/v1/analytics/activity` | Recent activity feed |
| GET | `/wp-json/wpra/v1/analytics/content-breakdown` | Content by post type |
| GET | `/wp-json/wpra/v1/posts/recent` | Recent posts with meta |

All endpoints require `edit_posts` capability.

## Tech Stack

- **React 18** via `@wordpress/element`
- **@wordpress/components** — Spinner, Notice
- **@wordpress/api-fetch** — Authenticated REST requests
- **@wordpress/scripts** — Build tooling (same as Gutenberg blocks)
- **PHP 8.1** OOP backend with DI container

## License

GPL v2 or later.
