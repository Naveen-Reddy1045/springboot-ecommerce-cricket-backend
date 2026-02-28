package com.ecom.cricketshop.order.service;

import com.ecom.cricketshop.auth.Role;
import com.ecom.cricketshop.auth.entity.User;
import com.ecom.cricketshop.auth.repo.UserRepository;
import com.ecom.cricketshop.cart.entity.Cart;
import com.ecom.cricketshop.cart.repo.CartRepository;
import com.ecom.cricketshop.exception.BadRequestException;
import com.ecom.cricketshop.exception.ResourceNotFoundException;
import com.ecom.cricketshop.order.OrderStatus;
import com.ecom.cricketshop.order.dto.OrderItemResponse;
import com.ecom.cricketshop.order.dto.OrderResponse;
import com.ecom.cricketshop.order.entity.Order;
import com.ecom.cricketshop.order.entity.OrderItem;
import com.ecom.cricketshop.order.repo.OrderRepository;
import com.ecom.cricketshop.product.entity.Product;
import com.ecom.cricketshop.product.repo.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;


    public OrderResponse placeOrder() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.USER) {
            throw new BadRequestException("Only buyers can place orders");
        }

        List<Cart> cartItems = cartRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.PLACED);

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;

        for (Cart cart : cartItems) {

            Product product = cart.getProduct();

            if (!Boolean.TRUE.equals(product.getIsActive())) {
                throw new BadRequestException(
                        "Product not available: " + product.getName()
                );
            }

            if (cart.getQuantity() > product.getStock()) {
                throw new BadRequestException(
                        "Insufficient stock for: " + product.getName()
                );
            }

            // reduce stock
            try {
                product.setStock(product.getStock() - cart.getQuantity());
                productRepository.save(product);
            } catch (ObjectOptimisticLockingFailureException e) {
                throw new BadRequestException(
                        "Product stock changed. Please try again."
                );
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(cart.getQuantity());
            item.setPrice(product.getPrice());

            total += product.getPrice() * cart.getQuantity();
            orderItems.add(item);
        }

        order.setTotalPrice(total);
        order.setOrderItems(orderItems);

        Order saved = orderRepository.save(order);

        // clear cart after successful order
        cartRepository.deleteAll(cartItems);

        return mapToOrderResponse(saved);
    }
    public List<OrderResponse> getMyOrders() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return orderRepository.findByUser(user)
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public List<OrderResponse> getSellerOrders() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        if (seller.getRole() != Role.SELLER) {
            throw new BadRequestException("Only sellers can view seller orders");
        }

        return orderRepository
                .findDistinctByOrderItemsProductSellerId(seller.getId())
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        if (seller.getRole() != Role.SELLER) {
            throw new BadRequestException("Only sellers can update order status");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        boolean ownsProduct = order.getOrderItems()
                .stream()
                .anyMatch(item ->
                        item.getProduct()
                                .getSeller()
                                .getId()
                                .equals(seller.getId())
                );

        if (!ownsProduct) {
            throw new BadRequestException("You cannot update this order");
        }

        order.setOrderStatus(status);

        return mapToOrderResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.USER) {
            throw new BadRequestException("Only buyers can cancel orders");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot cancel this order");
        }

        if (order.getOrderStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Delivered orders cannot be cancelled");
        }

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order already cancelled");
        }

        // Restore stock
        for (OrderItem item : order.getOrderItems()) {

            Product product = item.getProduct();

            product.setStock(product.getStock() + item.getQuantity());

            productRepository.save(product);
        }

        order.setOrderStatus(OrderStatus.CANCELLED);

        return mapToOrderResponse(orderRepository.save(order));
    }

    private OrderResponse mapToOrderResponse(Order order) {

        List<OrderItemResponse> items = order.getOrderItems()
                .stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getPrice() * item.getQuantity()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getCreatedAt(),
                order.getOrderStatus(),
                order.getTotalPrice(),
                items
        );
    }
}
