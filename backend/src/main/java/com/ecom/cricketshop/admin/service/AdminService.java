package com.ecom.cricketshop.admin.service;

import com.ecom.cricketshop.auth.entity.User;
import com.ecom.cricketshop.auth.repo.UserRepository;
import com.ecom.cricketshop.order.entity.Order;
import com.ecom.cricketshop.order.repo.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User toggleUserStatus(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsActive(!user.getIsActive());

        return userRepository.save(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public double getTotalRevenue() {

        List<Order> orders = orderRepository.findAll();

        double total = 0;

        for (Order order : orders) {
            total += order.getTotalPrice();
        }

        return total;
    }
}
