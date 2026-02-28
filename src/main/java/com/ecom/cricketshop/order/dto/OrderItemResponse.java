package com.ecom.cricketshop.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponse {

    private Long productId;
    private String productName;
    private int quantity;
    private double price;
    private double subtotal;
}
