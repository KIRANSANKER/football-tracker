package com.tracker.repository;

import com.tracker.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByStatus(String status);
    List<Match> findByHomeTeamIdOrAwayTeamId(Long homeTeamId, Long awayTeamId);
}
