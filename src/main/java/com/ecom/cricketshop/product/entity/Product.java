package com.ecom.cricketshop.product.entity;

import com.ecom.cricketshop.auth.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Data
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private double price;
    private int stock;
    private String category;
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
    private Boolean isActive;

    @Version
    private Long version;
}
