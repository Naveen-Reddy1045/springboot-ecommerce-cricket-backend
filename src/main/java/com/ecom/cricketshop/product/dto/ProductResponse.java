package com.ecom.cricketshop.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private double price;
    private int stock;
    private String category;
    private String imageUrl;

    private Long sellerId;
    private String sellerName;
}
