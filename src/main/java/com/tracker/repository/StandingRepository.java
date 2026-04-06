package com.tracker.repository;

import com.tracker.entity.Standing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StandingRepository extends JpaRepository<Standing, Long> {
    List<Standing> findAllByOrderByPointsDescGoalsForDesc();
    Standing findByTeamId(Long teamId);
}
