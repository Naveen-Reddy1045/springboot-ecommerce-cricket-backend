package com.ecom.cricketshop.cart.controller;

import com.ecom.cricketshop.cart.dto.CartRequest;
import com.ecom.cricketshop.cart.dto.CartResponse;
import com.ecom.cricketshop.cart.entity.Cart;
import com.ecom.cricketshop.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buyer/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public CartResponse addToCart(@RequestBody CartRequest cart) {

        return cartService.addToCart(
                cart.getProductId(),
                cart.getQuantity()
        );
    }

    @GetMapping
    public List<CartResponse> getCart() {
        return cartService.getCartByCurrentUser();
    }

    @DeleteMapping("/{cartId}")
    public String removeFromCart(@PathVariable Long cartId) {
        cartService.removeFromCart(cartId);
        return "Item removed";
    }

    @DeleteMapping("/clear")
    public String clearCart() {
        cartService.clearCartForCurrentUser();
        return "Cart cleared";
    }
}