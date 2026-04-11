package com.ecom.cricketshop.order.repo;

import com.ecom.cricketshop.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderIdAndProductSellerId(Long orderId, Long sellerId);
    List<OrderItem> findByOrderId(Long orderId);
}
