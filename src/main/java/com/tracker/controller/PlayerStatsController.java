package com.tracker.controller;

import com.tracker.entity.PlayerStats;
import com.tracker.repository.PlayerStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class PlayerStatsController {

    @Autowired
    private PlayerStatsRepository playerStatsRepository;

    @GetMapping
    public List<PlayerStats> getAllStats() {
        return playerStatsRepository.findAll();
    }

    @GetMapping("/player/{playerId}")
    public List<PlayerStats> getStatsByPlayer(@PathVariable Long playerId) {
        return playerStatsRepository.findByPlayerId(playerId);
    }

    @GetMapping("/match/{matchId}")
    public List<PlayerStats> getStatsByMatch(@PathVariable Long matchId) {
        return playerStatsRepository.findByMatchId(matchId);
    }

    @GetMapping("/top-scorers")
    public List<PlayerStats> getTopScorers() {
        return playerStatsRepository.findTopScorers();
    }

    @PostMapping
    public PlayerStats createStats(@RequestBody PlayerStats stats) {
        return playerStatsRepository.save(stats);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerStats> updateStats(@PathVariable Long id, @RequestBody PlayerStats details) {
        return playerStatsRepository.findById(id).map(stats -> {
            stats.setGoals(details.getGoals());
            stats.setAssists(details.getAssists());
            stats.setYellowCards(details.getYellowCards());
            stats.setRedCards(details.getRedCards());
            return ResponseEntity.ok(playerStatsRepository.save(stats));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStats(@PathVariable Long id) {
        if (!playerStatsRepository.existsById(id)) return ResponseEntity.notFound().build();
        playerStatsRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
