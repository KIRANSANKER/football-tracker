package com.tracker.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "standings")
public class Standing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id", unique = true)
    private Team team;

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Team getTeam() {
		return team;
	}

	public void setTeam(Team team) {
		this.team = team;
	}

	public int getPlayed() {
		return played;
	}

	public void setPlayed(int played) {
		this.played = played;
	}

	public int getWon() {
		return won;
	}

	public void setWon(int won) {
		this.won = won;
	}

	public int getDrawn() {
		return drawn;
	}

	public void setDrawn(int drawn) {
		this.drawn = drawn;
	}

	public int getLost() {
		return lost;
	}

	public void setLost(int lost) {
		this.lost = lost;
	}

	public int getGoalsFor() {
		return goalsFor;
	}

	public void setGoalsFor(int goalsFor) {
		this.goalsFor = goalsFor;
	}

	public int getGoalsAgainst() {
		return goalsAgainst;
	}

	public void setGoalsAgainst(int goalsAgainst) {
		this.goalsAgainst = goalsAgainst;
	}

	public int getPoints() {
		return points;
	}

	public void setPoints(int points) {
		this.points = points;
	}

	private int played;
    private int won;
    private int drawn;
    private int lost;
    private int goalsFor;
    private int goalsAgainst;
    private int points;

    public int getGoalDifference() {
        return goalsFor - goalsAgainst;
    }
}
