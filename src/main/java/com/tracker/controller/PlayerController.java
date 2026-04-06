package com.tracker.controller;

import com.tracker.entity.Player;
import com.tracker.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "*")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @GetMapping
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        return playerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/team/{teamId}")
    public List<Player> getPlayersByTeam(@PathVariable Long teamId) {
        return playerRepository.findByTeamId(teamId);
    }

    @GetMapping("/position/{position}")
    public List<Player> getPlayersByPosition(@PathVariable String position) {
        return playerRepository.findByPosition(position);
    }

    @GetMapping("/search")
    public List<Player> searchPlayers(@RequestParam String name) {
        return playerRepository.findByNameContainingIgnoreCase(name);
    }

    @PostMapping
    public Player createPlayer(@RequestBody Player player) {
        return playerRepository.save(player);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable Long id, @RequestBody Player playerDetails) {
        return playerRepository.findById(id).map(player -> {
            player.setName(playerDetails.getName());
            player.setPosition(playerDetails.getPosition());
            player.setJerseyNumber(playerDetails.getJerseyNumber());
            player.setNationality(playerDetails.getNationality());
            player.setAge(playerDetails.getAge());
            player.setTeam(playerDetails.getTeam());
            return ResponseEntity.ok(playerRepository.save(player));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        if (!playerRepository.existsById(id)) return ResponseEntity.notFound().build();
        playerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
