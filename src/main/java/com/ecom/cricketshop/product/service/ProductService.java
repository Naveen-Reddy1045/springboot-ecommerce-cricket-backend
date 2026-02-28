package com.ecom.cricketshop.product.service;

import com.ecom.cricketshop.auth.Role;
import com.ecom.cricketshop.auth.entity.User;
import com.ecom.cricketshop.auth.repo.UserRepository;
import com.ecom.cricketshop.exception.BadRequestException;
import com.ecom.cricketshop.exception.ResourceNotFoundException;
import com.ecom.cricketshop.product.dto.ProductRequest;
import com.ecom.cricketshop.product.dto.ProductResponse;
import com.ecom.cricketshop.product.entity.Product;
import com.ecom.cricketshop.product.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class ProductService {
    @Autowired
    private ProductRepository repo;
    @Autowired
    private UserRepository userRepository;

    public Page<ProductResponse> getAllProducts(
            String category,
            Double minPrice,
            Double maxPrice,
            Pageable pageable
    ) {

        return repo.filterProducts(category, minPrice, maxPrice, pageable)
                .map(this::mapToResponse);
    }

    public ProductResponse updateProduct(ProductRequest request, Long id) {

        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());

        Product updated = repo.save(product);

        return mapToResponse(updated);
    }

    public String deleteProduct(Long id) {

        Product product = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if(!product.getIsActive())
            throw new ResourceNotFoundException("Product not Found");

        product.setIsActive(false);
        repo.save(product);

        return "Product deactivated successfully";
    }

    public List<ProductResponse> findByKeyword(String key) {

        return repo.searchProducts(key)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProductResponse addProduct(ProductRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        if (seller.getRole() != Role.SELLER) {
            throw new BadRequestException("Only sellers can add products");
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setSeller(seller);
        product.setIsActive(true);

        Product saved = repo.save(product);

        return mapToResponse(saved);
    }

    private ProductResponse mapToResponse(Product product) {

        ProductResponse response = new ProductResponse();

        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setCategory(product.getCategory());

        response.setSellerId(product.getSeller().getId());
        response.setSellerName(product.getSeller().getName());

        return response;
    }
}
