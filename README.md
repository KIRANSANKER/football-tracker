# ⚽ Football Tracker

A full-stack Soccer tracking application built with **Spring Boot**, **MySQL**, and **HTML/CSS/JavaScript**.

---

## 🛠️ Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Backend    | Java 17 + Spring Boot 3 |
| ORM        | Spring Data JPA / Hibernate |
| Database   | MySQL 8                 |
| Frontend   | HTML5, CSS3, Vanilla JS |

---

## 📁 Project Structure

```
football-tracker/
├── src/main/java/com/tracker/
│   ├── entity/
│   │   ├── Team.java
│   │   ├── Player.java
│   │   ├── Match.java
│   │   ├── Standing.java
│   │   └── PlayerStats.java
│   ├── repository/
│   │   ├── TeamRepository.java
│   │   ├── PlayerRepository.java
│   │   ├── MatchRepository.java
│   │   ├── StandingRepository.java
│   │   └── PlayerStatsRepository.java
│   ├── controller/
│   │   ├── TeamController.java
│   │   ├── PlayerController.java
│   │   ├── MatchController.java
│   │   ├── StandingController.java
│   │   └── PlayerStatsController.java
│   └── FootballTrackerApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── static/
│       ├── index.html
│       ├── style.css
│       └── app.js
├── schema.sql
└── pom.xml
```

---

## 🚀 Setup & Run

### 1. Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+

### 2. Database Setup
```sql
-- Run the schema file in MySQL:
mysql -u root -p < schema.sql
```
Or open MySQL Workbench and run `schema.sql` manually.

### 3. Configure Database
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 4. Build & Run
```bash
mvn clean install
mvn spring-boot:run
```

### 5. Open in Browser
```
http://localhost:8080/index.html
```

---

## 🔌 REST API Endpoints

### Teams
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| GET    | /api/teams            | Get all teams      |
| GET    | /api/teams/{id}       | Get team by ID     |
| GET    | /api/teams/search?name= | Search teams     |
| POST   | /api/teams            | Create team        |
| PUT    | /api/teams/{id}       | Update team        |
| DELETE | /api/teams/{id}       | Delete team        |

### Players
| Method | Endpoint                     | Description           |
|--------|------------------------------|-----------------------|
| GET    | /api/players                 | Get all players       |
| GET    | /api/players/{id}            | Get player by ID      |
| GET    | /api/players/team/{teamId}   | Players by team       |
| GET    | /api/players/position/{pos}  | Players by position   |
| POST   | /api/players                 | Create player         |
| PUT    | /api/players/{id}            | Update player         |
| DELETE | /api/players/{id}            | Delete player         |

### Matches
| Method | Endpoint                      | Description          |
|--------|-------------------------------|----------------------|
| GET    | /api/matches                  | Get all matches      |
| GET    | /api/matches/status/{status}  | By status (SCHEDULED/COMPLETED/LIVE) |
| GET    | /api/matches/team/{teamId}    | By team              |
| POST   | /api/matches                  | Create match         |
| PUT    | /api/matches/{id}             | Update match         |
| DELETE | /api/matches/{id}             | Delete match         |

### Standings
| Method | Endpoint               | Description             |
|--------|------------------------|-------------------------|
| GET    | /api/standings         | Get standings (sorted)  |
| GET    | /api/standings/team/{id} | By team               |
| POST   | /api/standings         | Create standing entry   |
| PUT    | /api/standings/{id}    | Update standing         |

### Player Stats
| Method | Endpoint                    | Description         |
|--------|-----------------------------|---------------------|
| GET    | /api/stats                  | All stats           |
| GET    | /api/stats/player/{id}      | By player           |
| GET    | /api/stats/match/{id}       | By match            |
| GET    | /api/stats/top-scorers      | Top scorers         |
| POST   | /api/stats                  | Add stats entry     |
| PUT    | /api/stats/{id}             | Update stats        |

---

## ✨ Features

- 🏆 **League Standings** — sorted by points, with goal difference
- 📅 **Match Results** — scheduled, live, and completed matches
- 🛡️ **Team Management** — full CRUD with city & founding year
- 👤 **Player Profiles** — position, nationality, jersey number, team
- 📊 **Player Statistics** — goals, assists, yellow/red cards per match
- 🎨 **Dark UI** — responsive, modern dark theme

---

## 🔧 Future Enhancements

- Spring Security (JWT authentication)
- Pagination & filtering
- Season/League management
- Live score updates (WebSocket)
- Export standings to PDF/CSV
