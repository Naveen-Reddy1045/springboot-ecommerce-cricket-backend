package com.ecom.cricketshop.admin.service;

import com.ecom.cricketshop.admin.dto.SellerRevenueResponse;
import com.ecom.cricketshop.admin.dto.TopProductResponse;
import com.ecom.cricketshop.order.repo.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminAnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    public List<SellerRevenueResponse> getSellerRevenue() {
        return orderRepository.getRevenuePerSeller();
    }

    public List<TopProductResponse> getTopProducts() {
        return orderRepository.getTopSellingProducts(PageRequest.of(0, 5));
    }

}
