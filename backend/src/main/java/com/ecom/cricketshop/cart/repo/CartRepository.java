package com.ecom.cricketshop.cart.repo;

import com.ecom.cricketshop.auth.entity.User;
import com.ecom.cricketshop.cart.entity.Cart;
import com.ecom.cricketshop.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository  extends JpaRepository<Cart, Long> {
    public List<Cart> findByUser(User user);

    Optional<Cart> findByUserAndProduct(User user, Product product);

}
