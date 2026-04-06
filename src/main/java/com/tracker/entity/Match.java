package com.tracker.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "home_team_id")
    private Team homeTeam;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "away_team_id")
    private Team awayTeam;

    private int homeScore;
    private int awayScore;
    private LocalDate matchDate;
    private String venue;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'SCHEDULED'")
    private String status;

    // ---- Getters ----
    public Long getId()            { return id; }
    public Team getHomeTeam()      { return homeTeam; }
    public Team getAwayTeam()      { return awayTeam; }
    public int getHomeScore()      { return homeScore; }
    public int getAwayScore()      { return awayScore; }
    public LocalDate getMatchDate(){ return matchDate; }
    public String getVenue()       { return venue; }
    public String getStatus()      { return status; }

    // ---- Setters ----
    public void setId(Long id)                   { this.id = id; }
    public void setHomeTeam(Team homeTeam)        { this.homeTeam = homeTeam; }
    public void setAwayTeam(Team awayTeam)        { this.awayTeam = awayTeam; }
    public void setHomeScore(int homeScore)       { this.homeScore = homeScore; }
    public void setAwayScore(int awayScore)       { this.awayScore = awayScore; }
    public void setMatchDate(LocalDate matchDate) { this.matchDate = matchDate; }
    public void setVenue(String venue)            { this.venue = venue; }
    public void setStatus(String status)          { this.status = status; }
}