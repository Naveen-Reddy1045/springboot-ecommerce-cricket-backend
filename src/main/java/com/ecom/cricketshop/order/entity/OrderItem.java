package com.ecom.cricketshop.order.entity;

import com.ecom.cricketshop.product.entity.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name="order_id")
    @JsonIgnore
    private Order order;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    private double price;
}
