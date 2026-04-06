package com.tracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tournament_teams")
public class TournamentTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id")
    private Team team;

    // ---- Getters ----
    public Long getId()               { return id; }
    public Tournament getTournament() { return tournament; }
    public Team getTeam()             { return team; }

    // ---- Setters ----
    public void setId(Long id)                    { this.id = id; }
    public void setTournament(Tournament t)       { this.tournament = t; }
    public void setTeam(Team team)                { this.team = team; }
}
