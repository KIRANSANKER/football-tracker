package com.tracker.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tournament_matches")
public class TournamentMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "home_team_id")
    private Team homeTeam;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "away_team_id")
    private Team awayTeam;

    private int homeScore;
    private int awayScore;
    private LocalDate matchDate;
    private LocalTime matchTime;
    private String venue;
    private String status;
    private String round;

    @JsonIgnore
    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL)
    private List<TournamentMatchEvent> events;

    // ---- Getters ----
    public Long getId()               { return id; }
    public Tournament getTournament() { return tournament; }
    public Team getHomeTeam()         { return homeTeam; }
    public Team getAwayTeam()         { return awayTeam; }
    public int getHomeScore()         { return homeScore; }
    public int getAwayScore()         { return awayScore; }
    public LocalDate getMatchDate()   { return matchDate; }
    public LocalTime getMatchTime()   { return matchTime; }
    public String getVenue()          { return venue; }
    public String getStatus()         { return status; }
    public String getRound()          { return round; }
    public List<TournamentMatchEvent> getEvents() { return events; }

    // ---- Setters ----
    public void setId(Long id)                  { this.id = id; }
    public void setTournament(Tournament t)     { this.tournament = t; }
    public void setHomeTeam(Team t)             { this.homeTeam = t; }
    public void setAwayTeam(Team t)             { this.awayTeam = t; }
    public void setHomeScore(int s)             { this.homeScore = s; }
    public void setAwayScore(int s)             { this.awayScore = s; }
    public void setMatchDate(LocalDate d)       { this.matchDate = d; }
    public void setMatchTime(LocalTime t)       { this.matchTime = t; }
    public void setVenue(String v)              { this.venue = v; }
    public void setStatus(String s)             { this.status = s; }
    public void setRound(String r)              { this.round = r; }
    public void setEvents(List<TournamentMatchEvent> e) { this.events = e; }
}
