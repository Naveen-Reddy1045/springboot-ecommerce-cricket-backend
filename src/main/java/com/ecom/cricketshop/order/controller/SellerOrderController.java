package com.ecom.cricketshop.order.controller;

import com.ecom.cricketshop.order.OrderStatus;
import com.ecom.cricketshop.order.dto.OrderResponse;
import com.ecom.cricketshop.order.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seller/orders")
public class SellerOrderController {

    @Autowired
    private OrderService orderService;

    // View seller orders
    @GetMapping
    public List<OrderResponse> getSellerOrders() {
        return orderService.getSellerOrders();
    }

    // Update order status
    @PutMapping("/{orderId}/status")
    @Transactional
    public OrderResponse updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {

        return orderService.updateOrderStatus(orderId, status);
    }

    // Update a single item's status
    @PutMapping("/{orderId}/items/{itemId}/status")
    @Transactional
    public OrderResponse updateItemStatus(
            @PathVariable Long orderId,
            @PathVariable Long itemId,
            @RequestParam OrderStatus status) {

        return orderService.updateItemStatus(orderId, itemId, status);
    }
}
