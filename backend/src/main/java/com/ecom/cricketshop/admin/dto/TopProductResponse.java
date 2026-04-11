package com.ecom.cricketshop.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopProductResponse {

    private Long productId;
    private String productName;
    private Long totalQuantitySold;
    private Double totalRevenue;
}
