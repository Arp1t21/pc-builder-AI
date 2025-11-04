package org.example.pcbuilder.service;

import org.example.pcbuilder.model.PcBuild;
import org.example.pcbuilder.model.User;
import org.example.pcbuilder.repository.PcBuildRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BuildService {

    private final PcBuildRepository repo;

    public BuildService(PcBuildRepository repo) {
        this.repo = repo;
    }

    public PcBuild save(PcBuild build) {
        return repo.save(build);
    }

    public List<PcBuild> getByOwner(User owner) {
        return repo.findByOwner(owner);
    }

    public List<PcBuild> getPublicBuilds() {
        return repo.findByPublishedTrue();
    }

    public Optional<PcBuild> findById(Long id) {
        return repo.findById(id);
    }

    public void delete(PcBuild build) {
        repo.delete(build);
    }
}