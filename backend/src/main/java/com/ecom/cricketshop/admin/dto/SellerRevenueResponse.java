package com.ecom.cricketshop.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellerRevenueResponse {

    private Long sellerId;
    private String sellerName;
    private Double totalRevenue;
}
