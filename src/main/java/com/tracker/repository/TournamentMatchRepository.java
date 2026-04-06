package com.tracker.repository;

import com.tracker.entity.TournamentMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TournamentMatchRepository extends JpaRepository<TournamentMatch, Long> {
    List<TournamentMatch> findByTournamentId(Long tournamentId);
    List<TournamentMatch> findByTournamentIdAndStatus(Long tournamentId, String status);
    List<TournamentMatch> findByStatus(String status);
}
