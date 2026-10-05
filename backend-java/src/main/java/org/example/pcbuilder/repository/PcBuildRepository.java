package org.example.pcbuilder.repository;

import org.example.pcbuilder.model.PcBuild;
import org.example.pcbuilder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PcBuildRepository extends JpaRepository<PcBuild, Long> {
    List<PcBuild> findByOwner(User owner);
    List<PcBuild> findByPublishedTrue();
}