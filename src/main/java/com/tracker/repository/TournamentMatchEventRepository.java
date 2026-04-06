package com.tracker.repository;

import com.tracker.entity.TournamentMatchEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TournamentMatchEventRepository extends JpaRepository<TournamentMatchEvent, Long> {
    List<TournamentMatchEvent> findByMatchId(Long matchId);
    List<TournamentMatchEvent> findByPlayerId(Long playerId);

    @Query("SELECT e FROM TournamentMatchEvent e WHERE e.match.tournament.id = :tid AND e.eventType = 'GOAL'")
    List<TournamentMatchEvent> findGoalsByTournament(@Param("tid") Long tournamentId);

    @Query("SELECT e FROM TournamentMatchEvent e WHERE e.match.tournament.id = :tid")
    List<TournamentMatchEvent> findAllByTournament(@Param("tid") Long tournamentId);
}
