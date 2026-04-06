package com.tracker.controller;

import com.tracker.entity.Match;
import com.tracker.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    @Autowired
    private MatchRepository matchRepository;

    @GetMapping
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> getMatchById(@PathVariable Long id) {
        return matchRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public List<Match> getMatchesByStatus(@PathVariable String status) {
        return matchRepository.findByStatus(status.toUpperCase());
    }

    @GetMapping("/team/{teamId}")
    public List<Match> getMatchesByTeam(@PathVariable Long teamId) {
        return matchRepository.findByHomeTeamIdOrAwayTeamId(teamId, teamId);
    }

    @PostMapping
    public Match createMatch(@RequestBody Match match) {
        return matchRepository.save(match);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Match> updateMatch(@PathVariable Long id, @RequestBody Match matchDetails) {
        return matchRepository.findById(id).map(match -> {
            match.setHomeTeam(matchDetails.getHomeTeam());
            match.setAwayTeam(matchDetails.getAwayTeam());
            match.setHomeScore(matchDetails.getHomeScore());
            match.setAwayScore(matchDetails.getAwayScore());
            match.setMatchDate(matchDetails.getMatchDate());
            match.setVenue(matchDetails.getVenue());
            match.setStatus(matchDetails.getStatus());
            return ResponseEntity.ok(matchRepository.save(match));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        if (!matchRepository.existsById(id)) return ResponseEntity.notFound().build();
        matchRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
