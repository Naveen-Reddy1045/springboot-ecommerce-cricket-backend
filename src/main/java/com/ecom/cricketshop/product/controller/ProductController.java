package com.ecom.cricketshop.product.controller;
import com.ecom.cricketshop.common.ApiResponse;
import com.ecom.cricketshop.product.dto.ProductRequest;
import com.ecom.cricketshop.product.dto.ProductResponse;
import com.ecom.cricketshop.product.entity.Product;
import com.ecom.cricketshop.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ProductController {
    @Autowired
    private ProductService service;


    @GetMapping("/products")
    public ResponseEntity<ApiResponse<?>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            Pageable pageable) {

        Page<ProductResponse> page =
                service.getAllProducts(category, minPrice, maxPrice, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", page.getContent());
        response.put("pageNumber", page.getNumber());
        response.put("pageSize", page.getSize());
        response.put("totalElements", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        response.put("last", page.isLast());

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Products fetched successfully", response)
        );
    }

    @GetMapping("/products/{key}")
    public List<ProductResponse> getProductsByKeyword(@PathVariable String key) {
        return service.findByKeyword(key);
    }

    @PostMapping("/seller/products")
    public ResponseEntity<ApiResponse<ProductResponse>> addProduct(
            @Valid @RequestBody ProductRequest request) {

        ProductResponse response = service.addProduct(request);

        ApiResponse<ProductResponse> apiResponse =
                new ApiResponse<>(true, "Product created successfully", response);

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/seller/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@Valid
            @RequestBody ProductRequest request,
            @PathVariable Long id) {

        ProductResponse updated = service.updateProduct(request, id);

        ApiResponse<ProductResponse> response =
                new ApiResponse<>(true, "Product updated successfully", updated);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/seller/products/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {

        String message = service.deleteProduct(id);

        ApiResponse<String> response =
                new ApiResponse<>(true, message, null);

        return ResponseEntity.ok(response);
    }
}
