package com.tracker.repository;

import com.tracker.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByTeamId(Long teamId);
    List<Player> findByPosition(String position);
    List<Player> findByNameContainingIgnoreCase(String name);
}
