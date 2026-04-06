-- =============================================
-- Football Tracker - MySQL Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS football_tracker;
USE football_tracker;

-- Teams Table
CREATE TABLE teams (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    city         VARCHAR(100),
    logo_url     VARCHAR(255),
    founded_year INT
);

-- Players Table
CREATE TABLE players (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    position      VARCHAR(50),
    jersey_number INT,
    nationality   VARCHAR(100),
    age           INT,
    team_id       BIGINT,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
);

-- Matches Table
CREATE TABLE matches (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    home_team_id  BIGINT,
    away_team_id  BIGINT,
    home_score    INT DEFAULT 0,
    away_score    INT DEFAULT 0,
    match_date    DATE,
    venue         VARCHAR(100),
    status        VARCHAR(20) DEFAULT 'SCHEDULED',
    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id)
);

-- Standings Table
CREATE TABLE standings (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id        BIGINT UNIQUE,
    played         INT DEFAULT 0,
    won            INT DEFAULT 0,
    drawn          INT DEFAULT 0,
    lost           INT DEFAULT 0,
    goals_for      INT DEFAULT 0,
    goals_against  INT DEFAULT 0,
    points         INT DEFAULT 0,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Player Stats Table
CREATE TABLE player_stats (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id     BIGINT,
    match_id      BIGINT,
    goals         INT DEFAULT 0,
    assists       INT DEFAULT 0,
    yellow_cards  INT DEFAULT 0,
    red_cards     INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (match_id)  REFERENCES matches(id) ON DELETE CASCADE
);

-- =============================================
-- Sample Data
-- =============================================

INSERT INTO teams (name, city, founded_year) VALUES
('Manchester United', 'Manchester', 1878),
('Liverpool FC',      'Liverpool',  1892),
('Chelsea FC',        'London',     1905),
('Arsenal FC',        'London',     1886);

INSERT INTO players (name, position, jersey_number, nationality, age, team_id) VALUES
('Marcus Rashford',  'Forward',    10, 'English',   26, 1),
('Bruno Fernandes',  'Midfielder', 18, 'Portuguese', 29, 1),
('Mohamed Salah',    'Forward',    11, 'Egyptian',   31, 2),
('Virgil van Dijk',  'Defender',    4, 'Dutch',      32, 2),
('Raheem Sterling',  'Forward',     7, 'English',    29, 3),
('Mason Mount',      'Midfielder', 19, 'English',    25, 3),
('Bukayo Saka',      'Forward',     7, 'English',    22, 4),
('Martin Odegaard',  'Midfielder',  8, 'Norwegian',  25, 4);

INSERT INTO matches (home_team_id, away_team_id, home_score, away_score, match_date, venue, status) VALUES
(1, 2, 2, 1, '2024-01-10', 'Old Trafford',    'COMPLETED'),
(3, 4, 0, 2, '2024-01-12', 'Stamford Bridge', 'COMPLETED'),
(2, 3, 3, 1, '2024-01-18', 'Anfield',         'COMPLETED'),
(4, 1, 1, 1, '2024-01-20', 'Emirates Stadium','COMPLETED'),
(1, 3, 0, 0, '2024-02-01', 'Old Trafford',    'SCHEDULED'),
(2, 4, 0, 0, '2024-02-03', 'Anfield',         'SCHEDULED');

INSERT INTO standings (team_id, played, won, drawn, lost, goals_for, goals_against, points) VALUES
(4, 2, 1, 1, 0, 3, 1, 4),
(2, 2, 1, 0, 1, 4, 3, 3),
(1, 2, 1, 1, 0, 3, 2, 4),
(3, 2, 0, 0, 2, 1, 5, 0);

INSERT INTO player_stats (player_id, match_id, goals, assists, yellow_cards, red_cards) VALUES
(1, 1, 1, 1, 0, 0),
(2, 1, 1, 0, 1, 0),
(3, 1, 1, 0, 0, 0),
(7, 2, 2, 0, 0, 0),
(8, 2, 0, 2, 0, 0),
(3, 3, 2, 1, 0, 0),
(4, 3, 1, 0, 0, 0);

USE football_tracker;
SHOW TABLES;

