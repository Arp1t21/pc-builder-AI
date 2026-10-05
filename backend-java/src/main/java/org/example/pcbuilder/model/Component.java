package org.example.pcbuilder.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "components")
public class Component {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String brand;

    @Column(length = 500)
    private String name;

    private String chipset;

    @Column(columnDefinition = "text")
    private String specs;

    private BigDecimal price;
    private String imageUrl;

    // Constructors
    public Component() {
    }

    public Component(Long id, String category, String brand, String name,
                     String chipset, String specs, BigDecimal price, String imageUrl) {
        this.id = id;
        this.category = category;
        this.brand = brand;
        this.name = name;
        this.chipset = chipset;
        this.specs = specs;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getCategory() {
        return category;
    }

    public String getBrand() {
        return brand;
    }

    public String getName() {
        return name;
    }

    public String getChipset() {
        return chipset;
    }

    public String getSpecs() {
        return specs;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setChipset(String chipset) {
        this.chipset = chipset;
    }

    public void setSpecs(String specs) {
        this.specs = specs;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}