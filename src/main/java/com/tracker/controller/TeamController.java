package com.tracker.controller;

import com.tracker.entity.Team;
import com.tracker.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @GetMapping
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        return teamRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Team> searchTeams(@RequestParam String name) {
        return teamRepository.findByNameContainingIgnoreCase(name);
    }

    @PostMapping
    public Team createTeam(@RequestBody Team team) {
        return teamRepository.save(team);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable Long id, @RequestBody Team teamDetails) {
        return teamRepository.findById(id).map(team -> {
            team.setName(teamDetails.getName());
            team.setCity(teamDetails.getCity());
            team.setLogoUrl(teamDetails.getLogoUrl());
            team.setFoundedYear(teamDetails.getFoundedYear());
            return ResponseEntity.ok(teamRepository.save(team));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        if (!teamRepository.existsById(id)) return ResponseEntity.notFound().build();
        teamRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
