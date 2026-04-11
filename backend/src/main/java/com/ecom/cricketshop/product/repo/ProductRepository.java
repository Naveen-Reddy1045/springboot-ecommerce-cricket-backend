package com.ecom.cricketshop.product.repo;

import com.ecom.cricketshop.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
    @Query("""
    SELECT p FROM Product p 
    WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) 
       OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) 
       OR LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
    List<Product> searchProducts(@Param("keyword") String keyword);

    Page<Product> findByIsActiveTrue(Pageable pageable);

    @Query("""
    SELECT p FROM Product p
    WHERE p.isActive = true
    AND (:category IS NULL OR p.category = :category)
    AND (:minPrice IS NULL OR p.price >= :minPrice)
    AND (:maxPrice IS NULL OR p.price <= :maxPrice)
""")
    Page<Product> filterProducts(
            @Param("category") String category,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable
    );

    List<Product> findBySeller_IdAndIsActiveTrue(Long sellerId);
}
