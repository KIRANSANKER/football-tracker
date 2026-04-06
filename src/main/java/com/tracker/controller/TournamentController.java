package com.tracker.controller;

import com.tracker.entity.*;
import com.tracker.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/tournaments")
@CrossOrigin(origins = "*")
public class TournamentController {

    @Autowired private TournamentRepository tournamentRepo;
    @Autowired private TournamentTeamRepository tournamentTeamRepo;
    @Autowired private TournamentMatchRepository tournamentMatchRepo;
    @Autowired private TournamentMatchEventRepository eventRepo;
    @Autowired private TeamRepository teamRepo;
    @Autowired private PlayerRepository playerRepo;

    // =============================================
    // TOURNAMENT CRUD
    // =============================================

    @GetMapping
    public List<Tournament> getAllTournaments() {
        return tournamentRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Long id) {
        return tournamentRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public List<Tournament> getTournamentsByStatus(@PathVariable String status) {
        return tournamentRepo.findByStatus(status.toUpperCase());
    }

    @PostMapping
    public Tournament createTournament(@RequestBody Tournament tournament) {
        return tournamentRepo.save(tournament);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tournament> updateTournament(
            @PathVariable Long id, @RequestBody Tournament details) {
        return tournamentRepo.findById(id).map(t -> {
            t.setName(details.getName());
            t.setLocation(details.getLocation());
            t.setStartDate(details.getStartDate());
            t.setEndDate(details.getEndDate());
            t.setStatus(details.getStatus());
            t.setDescription(details.getDescription());
            return ResponseEntity.ok(tournamentRepo.save(t));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTournament(@PathVariable Long id) {
        if (!tournamentRepo.existsById(id)) return ResponseEntity.notFound().build();
        tournamentRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // =============================================
    // TOURNAMENT TEAMS
    // =============================================

    @GetMapping("/{id}/teams")
    public List<TournamentTeam> getTeamsInTournament(@PathVariable Long id) {
        return tournamentTeamRepo.findByTournamentId(id);
    }

    @PostMapping("/{id}/teams/{teamId}")
    public ResponseEntity<?> addTeamToTournament(
            @PathVariable Long id, @PathVariable Long teamId) {
        Tournament tournament = tournamentRepo.findById(id).orElse(null);
        Team team             = teamRepo.findById(teamId).orElse(null);
        if (tournament == null || team == null)
            return ResponseEntity.notFound().build();

        TournamentTeam tt = new TournamentTeam();
        tt.setTournament(tournament);
        tt.setTeam(team);
        return ResponseEntity.ok(tournamentTeamRepo.save(tt));
    }

    @DeleteMapping("/{id}/teams/{teamId}")
    public ResponseEntity<Void> removeTeamFromTournament(
            @PathVariable Long id, @PathVariable Long teamId) {
        tournamentTeamRepo.deleteByTournamentIdAndTeamId(id, teamId);
        return ResponseEntity.noContent().build();
    }

    // =============================================
    // TOURNAMENT MATCHES
    // =============================================

    @GetMapping("/{id}/matches")
    public List<TournamentMatch> getMatchesByTournament(@PathVariable Long id) {
        return tournamentMatchRepo.findByTournamentId(id);
    }

    @GetMapping("/{id}/matches/status/{status}")
    public List<TournamentMatch> getMatchesByStatus(
            @PathVariable Long id, @PathVariable String status) {
        return tournamentMatchRepo.findByTournamentIdAndStatus(id, status.toUpperCase());
    }

    @PostMapping("/{id}/matches")
    public ResponseEntity<?> createMatch(
            @PathVariable Long id, @RequestBody TournamentMatch match) {
        Tournament tournament = tournamentRepo.findById(id).orElse(null);
        if (tournament == null) return ResponseEntity.notFound().build();
        match.setTournament(tournament);
        return ResponseEntity.ok(tournamentMatchRepo.save(match));
    }

    @PutMapping("/matches/{matchId}")
    public ResponseEntity<TournamentMatch> updateMatch(
            @PathVariable Long matchId, @RequestBody TournamentMatch details) {
        return tournamentMatchRepo.findById(matchId).map(m -> {
            m.setHomeTeam(details.getHomeTeam());
            m.setAwayTeam(details.getAwayTeam());
            m.setHomeScore(details.getHomeScore());
            m.setAwayScore(details.getAwayScore());
            m.setMatchDate(details.getMatchDate());
            m.setMatchTime(details.getMatchTime());
            m.setVenue(details.getVenue());
            m.setStatus(details.getStatus());
            m.setRound(details.getRound());
            return ResponseEntity.ok(tournamentMatchRepo.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/matches/{matchId}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long matchId) {
        if (!tournamentMatchRepo.existsById(matchId))
            return ResponseEntity.notFound().build();
        tournamentMatchRepo.deleteById(matchId);
        return ResponseEntity.noContent().build();
    }

    // =============================================
    // MATCH EVENTS (GOALS & ASSISTS)
    // =============================================

    @GetMapping("/matches/{matchId}/events")
    public List<TournamentMatchEvent> getMatchEvents(@PathVariable Long matchId) {
        return eventRepo.findByMatchId(matchId);
    }

    @PostMapping("/matches/{matchId}/events")
    public ResponseEntity<?> addEvent(
            @PathVariable Long matchId, @RequestBody TournamentMatchEvent event) {
        TournamentMatch match = tournamentMatchRepo.findById(matchId).orElse(null);
        if (match == null) return ResponseEntity.notFound().build();
        event.setMatch(match);

        // Auto update score if it's a goal
        if ("GOAL".equals(event.getEventType())) {
            Team scoringTeam = event.getTeam();
            if (scoringTeam != null) {
                if (match.getHomeTeam().getId().equals(scoringTeam.getId())) {
                    match.setHomeScore(match.getHomeScore() + 1);
                } else {
                    match.setAwayScore(match.getAwayScore() + 1);
                }
                tournamentMatchRepo.save(match);
            }
        }
        return ResponseEntity.ok(eventRepo.save(event));
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        if (!eventRepo.existsById(eventId)) return ResponseEntity.notFound().build();
        eventRepo.deleteById(eventId);
        return ResponseEntity.noContent().build();
    }

    // =============================================
    // TOURNAMENT STATS (Player Stats per Tournament)
    // =============================================

    @GetMapping("/{id}/stats")
    public ResponseEntity<?> getTournamentStats(@PathVariable Long id) {
        List<TournamentMatchEvent> events = eventRepo.findAllByTournament(id);

        Map<Long, Map<String, Object>> statsMap = new LinkedHashMap<>();
        for (TournamentMatchEvent e : events) {
            Long pid = e.getPlayer().getId();
            if (!statsMap.containsKey(pid)) {
                Map<String, Object> s = new LinkedHashMap<>();
                s.put("playerId",   pid);
                s.put("playerName", e.getPlayer().getName());
                s.put("teamName",   e.getTeam().getName());
                s.put("goals",      0);
                s.put("assists",    0);
                statsMap.put(pid, s);
            }
            Map<String, Object> s = statsMap.get(pid);
            if ("GOAL".equals(e.getEventType())) {
                s.put("goals", (int) s.get("goals") + 1);
            }

            // Count assists
            if (e.getAssistBy() != null) {
                Long apid = e.getAssistBy().getId();
                if (!statsMap.containsKey(apid)) {
                    Map<String, Object> as = new LinkedHashMap<>();
                    as.put("playerId",   apid);
                    as.put("playerName", e.getAssistBy().getName());
                    as.put("teamName",   e.getTeam().getName());
                    as.put("goals",      0);
                    as.put("assists",    0);
                    statsMap.put(apid, as);
                }
                Map<String, Object> as = statsMap.get(apid);
                as.put("assists", (int) as.get("assists") + 1);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>(statsMap.values());
        result.sort((a, b) -> (int) b.get("goals") - (int) a.get("goals"));
        return ResponseEntity.ok(result);
    }

    // =============================================
    // TOURNAMENT STANDINGS
    // =============================================

    @GetMapping("/{id}/standings")
    public ResponseEntity<?> getTournamentStandings(@PathVariable Long id) {
        List<TournamentTeam> teams   = tournamentTeamRepo.findByTournamentId(id);
        List<TournamentMatch> matches = tournamentMatchRepo
                .findByTournamentIdAndStatus(id, "COMPLETED");

        Map<Long, Map<String, Object>> table = new LinkedHashMap<>();

        for (TournamentTeam tt : teams) {
            Long tid = tt.getTeam().getId();
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("teamId",   tid);
            row.put("teamName", tt.getTeam().getName());
            row.put("played",   0);
            row.put("won",      0);
            row.put("drawn",    0);
            row.put("lost",     0);
            row.put("gf",       0);
            row.put("ga",       0);
            row.put("points",   0);
            table.put(tid, row);
        }

        for (TournamentMatch m : matches) {
            Long htid = m.getHomeTeam().getId();
            Long atid = m.getAwayTeam().getId();
            int  hs   = m.getHomeScore();
            int  as   = m.getAwayScore();

            if (table.containsKey(htid)) {
                Map<String, Object> r = table.get(htid);
                r.put("played", (int) r.get("played") + 1);
                r.put("gf",     (int) r.get("gf") + hs);
                r.put("ga",     (int) r.get("ga") + as);
                if (hs > as)      { r.put("won",   (int)r.get("won")+1);   r.put("points",(int)r.get("points")+3); }
                else if (hs == as){ r.put("drawn", (int)r.get("drawn")+1); r.put("points",(int)r.get("points")+1); }
                else              { r.put("lost",  (int)r.get("lost")+1); }
            }
            if (table.containsKey(atid)) {
                Map<String, Object> r = table.get(atid);
                r.put("played", (int) r.get("played") + 1);
                r.put("gf",     (int) r.get("gf") + as);
                r.put("ga",     (int) r.get("ga") + hs);
                if (as > hs)      { r.put("won",   (int)r.get("won")+1);   r.put("points",(int)r.get("points")+3); }
                else if (hs == as){ r.put("drawn", (int)r.get("drawn")+1); r.put("points",(int)r.get("points")+1); }
                else              { r.put("lost",  (int)r.get("lost")+1); }
            }
        }

        List<Map<String, Object>> result = new ArrayList<>(table.values());
        result.sort((a, b) -> (int) b.get("points") - (int) a.get("points"));
        return ResponseEntity.ok(result);
    }
}
