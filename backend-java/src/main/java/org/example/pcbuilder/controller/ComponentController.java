package org.example.pcbuilder.controller;

import org.example.pcbuilder.model.Component;
import org.example.pcbuilder.repository.ComponentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/components")
public class ComponentController {

    private final ComponentRepository repo;

    public ComponentController(ComponentRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Component> getAll() {
        return repo.findAll();
    }

    @GetMapping("/category/{cat}")
    public List<Component> getByCategory(@PathVariable String cat) {
        return repo.findByCategoryIgnoreCase(cat);
    }

    // Admin endpoints could be added to add components (omitted auth for brevity)
    @PostMapping
    public Component create(@RequestBody Component c) {
        return repo.save(c);
    }
}