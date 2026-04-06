package com.tracker.repository;

import com.tracker.entity.PlayerStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlayerStatsRepository extends JpaRepository<PlayerStats, Long> {
    List<PlayerStats> findByPlayerId(Long playerId);
    List<PlayerStats> findByMatchId(Long matchId);

    @Query("SELECT ps FROM PlayerStats ps ORDER BY ps.goals DESC")
    List<PlayerStats> findTopScorers();
}
