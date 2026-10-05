package org.example.pcbuilder.repository;

import org.example.pcbuilder.model.PcBuild;
import org.example.pcbuilder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuildRepository extends JpaRepository<PcBuild, Long> {
    List<PcBuild> findByOwner(User owner);

    @Query("SELECT b FROM PcBuild b WHERE b.published = true ORDER BY b.createdAt DESC")
    List<PcBuild> findAllPublic();
}