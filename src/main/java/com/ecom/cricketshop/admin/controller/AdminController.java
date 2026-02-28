package com.ecom.cricketshop.admin.controller;

import com.ecom.cricketshop.admin.service.AdminService;
import com.ecom.cricketshop.auth.entity.User;
import com.ecom.cricketshop.order.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PutMapping("users/{userId}/toggle")
    public User toggleUserStatus(@PathVariable Long userId) {
        return adminService.toggleUserStatus(userId);
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return adminService.getAllOrders();
    }

    @GetMapping("/revenue")
    public double getTotalRevenue() {
        return adminService.getTotalRevenue();
    }
}
