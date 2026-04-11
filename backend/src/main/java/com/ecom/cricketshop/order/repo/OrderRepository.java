package com.ecom.cricketshop.order.repo;

import com.ecom.cricketshop.admin.dto.SellerRevenueResponse;
import com.ecom.cricketshop.admin.dto.TopProductResponse;
import com.ecom.cricketshop.auth.entity.User;
import com.ecom.cricketshop.order.entity.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    public List<Order> findByUser(User user);
    List<Order> findDistinctByOrderItemsProductSellerId(Long sellerId);
    @Query("""
    SELECT new com.ecom.cricketshop.admin.dto.SellerRevenueResponse(
        p.seller.id,
        p.seller.name,
        SUM(oi.price * oi.quantity)
    )
    FROM OrderItem oi
    JOIN oi.product p
    JOIN oi.order o
    WHERE o.orderStatus = 'SHIPPING'
    GROUP BY p.seller.id, p.seller.name
""")
    List<SellerRevenueResponse> getRevenuePerSeller();

    @Query("""
    SELECT new com.ecom.cricketshop.admin.dto.TopProductResponse(
        p.id,
        p.name,
        SUM(oi.quantity),
        SUM(oi.price * oi.quantity)
    )
    FROM OrderItem oi
    JOIN oi.product p
    JOIN oi.order o
    WHERE o.orderStatus = 'SHIPPING'
    GROUP BY p.id, p.name
    ORDER BY SUM(oi.quantity) DESC
""")
    List<TopProductResponse> getTopSellingProducts(Pageable pageable);
}
