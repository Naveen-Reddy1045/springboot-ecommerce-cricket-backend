package com.ecom.cricketshop.cart.service;

import com.ecom.cricketshop.auth.Role;
import com.ecom.cricketshop.auth.entity.User;
import com.ecom.cricketshop.auth.repo.UserRepository;
import com.ecom.cricketshop.cart.dto.CartResponse;
import com.ecom.cricketshop.cart.entity.Cart;
import com.ecom.cricketshop.cart.repo.CartRepository;
import com.ecom.cricketshop.exception.BadRequestException;
import com.ecom.cricketshop.exception.ResourceNotFoundException;
import com.ecom.cricketshop.product.entity.Product;
import com.ecom.cricketshop.product.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Get currently logged-in user
    private User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // Add to cart
    public CartResponse addToCart(Long productId, int quantity) {

        User user = getCurrentUser();

        if (user.getRole() != Role.USER) {
            throw new BadRequestException("Only buyers can add to cart");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!Boolean.TRUE.equals(product.getIsActive())) {
            throw new BadRequestException("Product is not available");
        }

        if (product.getStock() < quantity) {
            throw new BadRequestException("Insufficient stock");
        }

        Optional<Cart> existingCart =
                cartRepository.findByUserAndProduct(user, product);

        Cart cart;

        if (existingCart.isPresent()) {

            cart = existingCart.get();

            int newQuantity = cart.getQuantity() + quantity;

            if (product.getStock() < newQuantity) {
                throw new BadRequestException("Insufficient stock");
            }

            cart.setQuantity(newQuantity);

        } else {

            cart = new Cart();
            cart.setUser(user);
            cart.setProduct(product);
            cart.setQuantity(quantity);
        }

        Cart saved = cartRepository.save(cart);

        return mapToResponse(saved);
    }

    // Get current user cart
    public List<CartResponse> getCartByCurrentUser() {

        User user = getCurrentUser();

        return cartRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    //  Remove single cart item
    public void removeFromCart(Long cartId) {

        User user = getCurrentUser();

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        // Ownership validation
        if (!cart.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot remove another user's cart item");
        }

        cartRepository.delete(cart);
    }

    // Clear cart
    public void clearCartForCurrentUser() {

        User user = getCurrentUser();

        List<Cart> cartItems = cartRepository.findByUser(user);

        cartRepository.deleteAll(cartItems);
    }

    private CartResponse mapToResponse(Cart cart) {

        CartResponse response = new CartResponse();

        response.setId(cart.getId());
        response.setProductId(cart.getProduct().getId());
        response.setProductName(cart.getProduct().getName());
        response.setPrice(cart.getProduct().getPrice());
        response.setQuantity(cart.getQuantity());
        response.setSubtotal(
                cart.getProduct().getPrice() * cart.getQuantity()
        );

        return response;
    }
}
