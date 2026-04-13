package com.tracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String position;
    private int jerseyNumber;
    private String nationality;
    private int age;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String photoUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id")
    private Team team;

    // ---- Getters ----
    public Long getId()            { return id; }
    public String getName()        { return name; }
    public String getPosition()    { return position; }
    public int getJerseyNumber()   { return jerseyNumber; }
    public String getNationality() { return nationality; }
    public int getAge()            { return age; }
    public String getPhotoUrl()    { return photoUrl; }
    public Team getTeam()          { return team; }

    // ---- Setters ----
    public void setId(Long id)                     { this.id = id; }
    public void setName(String name)               { this.name = name; }
    public void setPosition(String position)       { this.position = position; }
    public void setJerseyNumber(int jerseyNumber)  { this.jerseyNumber = jerseyNumber; }
    public void setNationality(String nationality) { this.nationality = nationality; }
    public void setAge(int age)                    { this.age = age; }
    public void setPhotoUrl(String photoUrl)       { this.photoUrl = photoUrl; }
    public void setTeam(Team team)                 { this.team = team; }
}
