package com.tracker.repository;

import com.tracker.entity.TournamentTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TournamentTeamRepository extends JpaRepository<TournamentTeam, Long> {
    List<TournamentTeam> findByTournamentId(Long tournamentId);
    void deleteByTournamentIdAndTeamId(Long tournamentId, Long teamId);
}
