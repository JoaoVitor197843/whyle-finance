# WhyleFinance

A full-stack personal finance management platform built to help users understand their spending habits through interactive dashboards, categorized transactions, and financial insights.

The project was created as a personal challenge to build a production-ready web application while solving a real-world problem: helping people visualize where their money goes and identify spending patterns that can lead to recurring debt.

The name **Whyle** comes from the programming keyword `while`, representing the repetitive financial loops that many people experience with debt and uncontrolled spending.

🌐 **Live:** https://app.whylefinance.dev

![License](https://img.shields.io/github/license/JoaoVitor197843/whyle-finance)
![Python](https://img.shields.io/badge/Python-3.13-blue)
![Django](https://img.shields.io/badge/Django-REST%20Framework-green)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-black)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)
![DigitalOcean](https://img.shields.io/badge/Backend-DigitalOcean-0080FF)

---

# Architecture

```text
                 React + TypeScript
                        │
                  Axios / HTTPS
                        │
                        ▼
          Django REST Framework API
                        │
                        ▼
          PostgreSQL (Supabase)
                        │
                        ▼
 Ubuntu Server (DigitalOcean VPS)
                        │
              Gunicorn + Nginx
```

---

# Screenshots

## Landing Page

![](./screenshots/landing.png)

## Dashboard

![](./screenshots/dashboard.png)

## Transactions

![](./screenshots/transactions.png)

---

# Features

## Authentication

- JWT Authentication
- HttpOnly Cookies
- Automatic Access Token Refresh
- Token Blacklist
- Email Verification
- Password Reset via Resend

## Financial Management

- Create, edit and delete transactions
- Income and expense tracking
- Custom transaction categories
- Monthly financial summary
- Current balance overview

## Analytics

- Interactive dashboard
- Expense distribution by category
- Line chart with historical data
- Period filters:
  - 1 Week
  - 1 Month
  - 6 Months
  - 12 Months
  - All Time

## User Experience

- Responsive design
- Mobile support
- Dashboard-oriented interface
- Accessibility-focused implementation

---

# Tech Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React | User Interface |
| TypeScript | Static typing |
| Vite | Build tool |
| Material UI | UI Components |
| MUI X Charts | Charts |
| React Hook Form | Form management |
| Axios | HTTP Client |
| React Router | Routing |

---

## Backend

| Technology | Purpose |
|------------|---------|
| Python | Programming Language |
| Django | Web Framework |
| Django REST Framework | REST API |
| SimpleJWT | Authentication |
| Resend | Transactional Emails |

---

## Database

- PostgreSQL (Supabase)

---

## Infrastructure

| Technology | Purpose |
|------------|---------|
| Ubuntu Server 24.04 | Production Environment |
| DigitalOcean | VPS |
| Gunicorn | WSGI Server |
| Nginx | Reverse Proxy |
| GitHub Actions | CI/CD Deployment |
| Certbot | HTTPS Certificates |
| SSH | Secure Deployment |
| Vercel | Frontend Hosting |
| Name.com | Domain Management |

---

# Technical Highlights

This project was designed to simulate a real production environment rather than being only a CRUD application.

Some engineering challenges solved during development include:

- Production deployment on a Linux VPS.
- Reverse proxy configuration with Nginx.
- HTTPS configuration using Let's Encrypt (Certbot).
- Automated deployment pipeline using GitHub Actions.
- JWT authentication with Refresh Tokens.
- Secure authentication using HttpOnly cookies.
- Responsive interface following accessibility recommendations.
- Backend optimization using Django ORM.

---

# Performance Improvements

One of the biggest technical challenges during development was optimizing expensive database queries.

The API initially suffered from **N+1 query problems**, generating unnecessary database requests while loading related models.

After redesigning the ORM queries and grouping operations into optimized database calls, the response time of some endpoints was reduced significantly while decreasing database workload.

This optimization process became an excellent opportunity to better understand:

- Query optimization
- Django ORM internals
- Database relationships
- Backend performance analysis

---

# What I Learned

Building WhyleFinance allowed me to gain practical experience with topics such as:

- Full-stack application architecture
- REST API development
- Production deployment
- Linux server administration
- Reverse proxy configuration
- HTTPS certificates
- CI/CD pipelines
- PostgreSQL
- Authentication flows using JWT
- Database optimization
- Accessibility best practices (W3C)
- UI/UX principles
- Frontend and backend integration

---

# What I'd Improve Today

Looking back at the project, there are several improvements I would make today.

- Use a different frontend framework (likely Next.js).
- Add automated tests.
- Document the API using OpenAPI/Swagger.
- Introduce caching for expensive endpoints.
- Improve dashboard analytics.
- Refactor some backend components to reduce memory consumption.

The project represents an important milestone in my learning journey, and these improvements reflect how my knowledge has evolved since its initial development.

---

# Running Locally

## Requirements

- Python 3.13+
- Pipenv
- Node.js 18+

---

## Backend

```bash
git clone https://github.com/JoaoVitor197843/whyle-finance.git

cd whyle-finance

pipenv install
pipenv shell

cd backend

# Configure your .env file

python manage.py migrate
python manage.py runserver
```

---

## Frontend

```bash
cd frontend

npm install

# Configure your .env file

npm run dev
```

---

# Environment Variables

## Backend

```env
DEVELOPMENT_SECRET_KEY=
PRODUCTION_SECRET_KEY=

DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=

RESEND_API_KEY=
RESEND_EMAIL=
```

---

## Frontend

```env
VITE_API_URL=
```

---

# Project Motivation

The main objective of WhyleFinance was never to compete with existing financial platforms.

Instead, the project was built as a learning experience to explore the complete lifecycle of a modern web application—from frontend development to backend architecture, deployment, authentication, database optimization, and production infrastructure.

At the same time, it aims to help users better understand their financial habits through clear visualizations and interactive dashboards.

---

# License

This project is licensed under the MIT License.
