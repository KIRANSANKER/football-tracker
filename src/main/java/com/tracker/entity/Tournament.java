package com.tracker.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tournaments")
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String location;
    private LocalDate startDate;
    private LocalDate endDate;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'UPCOMING'")
    private String status;

    private String description;

    @JsonIgnore
    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL)
    private List<TournamentMatch> matches;

    @JsonIgnore
    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL)
    private List<TournamentTeam> tournamentTeams;

    // ---- Getters ----
    public Long getId()            { return id; }
    public String getName()        { return name; }
    public String getLocation()    { return location; }
    public LocalDate getStartDate(){ return startDate; }
    public LocalDate getEndDate()  { return endDate; }
    public String getStatus()      { return status; }
    public String getDescription() { return description; }
    public List<TournamentMatch> getMatches()          { return matches; }
    public List<TournamentTeam> getTournamentTeams()   { return tournamentTeams; }

    // ---- Setters ----
    public void setId(Long id)                { this.id = id; }
    public void setName(String name)          { this.name = name; }
    public void setLocation(String location)  { this.location = location; }
    public void setStartDate(LocalDate d)     { this.startDate = d; }
    public void setEndDate(LocalDate d)       { this.endDate = d; }
    public void setStatus(String status)      { this.status = status; }
    public void setDescription(String desc)   { this.description = desc; }
    public void setMatches(List<TournamentMatch> m)        { this.matches = m; }
    public void setTournamentTeams(List<TournamentTeam> t) { this.tournamentTeams = t; }
}
