# Rivyuu-Connect 🚀

> **Trust-Based Review Ecosystem** — Where authentic voices earn reputation, badges, and real influence.

Built for **Hackathon 2025** | Full-Stack: React + Vite (Frontend) & Spring Boot 3 (Backend)

---

## 🌟 Features

| Feature | Description |
|---|---|
| 🔐 JWT Authentication | Secure login/register with JWT tokens |
| ⭐ Review System | Write, rate, tag and vote on reviews |
| 🤖 AI Sentiment Analysis | Real-time sentiment scoring via NLP |
| 🏆 Leaderboard | Animated podium with trust-score rankings |
| 🛡️ Trust Score | AI-verified authenticity metric (0–100) |
| 🎖️ Badge System | 8+ badges with rarity tiers (Common → Legendary) |
| 📊 Business Dashboard | Analytics with bar charts, donut chart, category scores |
| 🔔 Notifications | Real-time activity notifications |
| ⚙️ Settings | Account, privacy, notification & appearance settings |
| 📱 Fully Responsive | Mobile-first dark glassmorphism design |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite 5**
- **React Router v6** — client-side routing
- **Vanilla CSS** — custom design system with CSS variables
- **Canvas API** — Trust score graph
- **localStorage** — Demo-mode persistence

### Backend
- **Java 17** + **Spring Boot 3.2**
- **Spring Security** + **JWT (JJWT)**
- **Spring Data JPA** + **PostgreSQL**
- **Lombok** — boilerplate reduction
- **Maven** — build tool

---

## 🚀 Quick Start (Frontend Demo)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173**

### Demo Login
- **Email:** `arjun@example.com`
- **Password:** `demo123`

---

## 🔧 Backend Setup

### Prerequisites
- Java 17+
- PostgreSQL 14+
- Maven 3.8+

### Steps

```bash
# 1. Create PostgreSQL database
createdb rivyuu_db

# 2. Update credentials
# Edit: backend/src/main/resources/application.properties
spring.datasource.username=your_pg_username
spring.datasource.password=your_pg_password

# 3. Build and run
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on **http://localhost:8080**

---

## 📁 Project Structure

```
Rivyuu-Connect/
├── frontend/                    # React + Vite SPA
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route pages
│   │   ├── services/            # API + mock services
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Helpers + mock data
│   │   ├── App.jsx              # Router & layout
│   │   └── index.css            # Global design system
│   └── package.json
│
├── backend/                     # Spring Boot API
│   ├── src/main/java/com/rivyuu/connect/
│   │   ├── entity/              # JPA entities
│   │   ├── repository/          # JPA repositories
│   │   ├── service/             # Business logic
│   │   ├── controller/          # REST controllers
│   │   ├── security/            # JWT auth
│   │   ├── config/              # Spring config
│   │   └── dto/                 # Data transfer objects
│   └── pom.xml
│
├── docs/                        # Documentation
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login + get JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/reviews` | No | Get all reviews |
| POST | `/api/reviews` | Yes | Create review |
| POST | `/api/reviews/{id}/vote` | Yes | Vote helpful/not |
| POST | `/api/reviews/{id}/respond` | Business | Business response |
| GET | `/api/users/leaderboard` | No | Get leaderboard |
| GET | `/api/businesses` | No | Get businesses |

---

## 🎨 Design System

- **Colors:** Dark base (`#08080f`) + Purple primary (`#7c3aed`) + Cyan secondary (`#06b6d4`)
- **Font:** Inter (body) + Space Grotesk (display)
- **Style:** Glassmorphism + subtle gradients + micro-animations
- **Charts:** Pure Canvas/SVG — zero external chart libs

---

## 👥 Team

Built with ❤️ for Hackathon 2025

---

## 📄 License

MIT License — See [LICENSE](LICENSE)
