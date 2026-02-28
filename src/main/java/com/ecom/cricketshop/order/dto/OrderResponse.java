package com.ecom.cricketshop.order.dto;

import com.ecom.cricketshop.order.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {

    private Long orderId;
    private LocalDateTime createdAt;
    private OrderStatus status;
    private double totalPrice;

    private List<OrderItemResponse> items;
}
