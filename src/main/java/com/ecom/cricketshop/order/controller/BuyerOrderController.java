package com.ecom.cricketshop.order.controller;


import com.ecom.cricketshop.order.dto.OrderResponse;
import com.ecom.cricketshop.order.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buyer/orders")
public class BuyerOrderController {

    @Autowired
    private OrderService orderService;

    // Place order
    @PostMapping("/place")
    @Transactional
    public OrderResponse placeOrder() {
        return orderService.placeOrder();
    }

    // Get my orders
    @GetMapping
    public List<OrderResponse> getMyOrders() {
        return orderService.getMyOrders();
    }

    @PutMapping("/{orderId}/cancel")
    public OrderResponse cancelOrder(@PathVariable Long orderId) {
        return orderService.cancelOrder(orderId);
    }
}
