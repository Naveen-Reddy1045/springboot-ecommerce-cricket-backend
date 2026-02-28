package com.ecom.cricketshop.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {

        @NotBlank(message = "Product name is required")
        private String name;

        @NotBlank(message = "Description is required")
        private String description;

        @Positive(message = "Price must be greater than 0")
        private double price;

        @PositiveOrZero(message = "Stock cannot be negative")
        private int stock;

        @NotBlank(message = "Category is required")
        private String category;
}
