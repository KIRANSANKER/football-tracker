package com.tracker.controller;

import com.tracker.entity.Standing;
import com.tracker.repository.StandingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/standings")
@CrossOrigin(origins = "*")
public class StandingController {

    @Autowired
    private StandingRepository standingRepository;

    @GetMapping
    public List<Standing> getAllStandings() {
        return standingRepository.findAllByOrderByPointsDescGoalsForDesc();
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<Standing> getStandingByTeam(@PathVariable Long teamId) {
        Standing standing = standingRepository.findByTeamId(teamId);
        return standing != null ? ResponseEntity.ok(standing) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Standing createStanding(@RequestBody Standing standing) {
        return standingRepository.save(standing);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Standing> updateStanding(@PathVariable Long id, @RequestBody Standing details) {
        return standingRepository.findById(id).map(standing -> {
            standing.setPlayed(details.getPlayed());
            standing.setWon(details.getWon());
            standing.setDrawn(details.getDrawn());
            standing.setLost(details.getLost());
            standing.setGoalsFor(details.getGoalsFor());
            standing.setGoalsAgainst(details.getGoalsAgainst());
            standing.setPoints(details.getPoints());
            return ResponseEntity.ok(standingRepository.save(standing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStanding(@PathVariable Long id) {
        if (!standingRepository.existsById(id)) return ResponseEntity.notFound().build();
        standingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
