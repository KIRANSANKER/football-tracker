package com.tracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tournament_match_events")
public class TournamentMatchEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "match_id")
    private TournamentMatch match;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id")
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id")
    private Team team;

    private String eventType;  // GOAL, OWN_GOAL
    private int minute;
    private boolean ownGoal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assist_by")
    private Player assistBy;

    // ---- Getters ----
    public Long getId()               { return id; }
    public TournamentMatch getMatch() { return match; }
    public Player getPlayer()         { return player; }
    public Team getTeam()             { return team; }
    public String getEventType()      { return eventType; }
    public int getMinute()            { return minute; }
    public boolean isOwnGoal()        { return ownGoal; }
    public Player getAssistBy()       { return assistBy; }

    // ---- Setters ----
    public void setId(Long id)                    { this.id = id; }
    public void setMatch(TournamentMatch m)        { this.match = m; }
    public void setPlayer(Player p)               { this.player = p; }
    public void setTeam(Team t)                   { this.team = t; }
    public void setEventType(String e)            { this.eventType = e; }
    public void setMinute(int m)                  { this.minute = m; }
    public void setOwnGoal(boolean ownGoal)       { this.ownGoal = ownGoal; }
    public void setAssistBy(Player p)             { this.assistBy = p; }
}
