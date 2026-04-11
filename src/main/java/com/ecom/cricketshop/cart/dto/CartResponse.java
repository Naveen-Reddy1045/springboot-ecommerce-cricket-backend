package com.ecom.cricketshop.cart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {

    private Long id;

    private Long productId;
    private String productName;
    private double price;
    private String imageUrl;

    private int quantity;
    private double subtotal;
}
