package com.ecom.cricketshop.admin.controller;

import com.ecom.cricketshop.admin.dto.SellerRevenueResponse;
import com.ecom.cricketshop.admin.dto.TopProductResponse;
import com.ecom.cricketshop.admin.service.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/analytics")
public class AdminAnalyticsController {
    @Autowired
    private AdminAnalyticsService analyticsService;

    @GetMapping("/seller-revenue")
    public List<SellerRevenueResponse> getSellerRevenue() {
        return analyticsService.getSellerRevenue();
    }

    @GetMapping("/top-products")
    public List<TopProductResponse> getTopProducts() {
        return analyticsService.getTopProducts();
    }
}
