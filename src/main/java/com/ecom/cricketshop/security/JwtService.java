package com.ecom.cricketshop.security;

import com.ecom.cricketshop.auth.Role;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@Data
public class JwtService {

    @Value("${spring.app.secretKey}")
    private String secretKey;

    @Value("${spring.app.jwtExpiration}")
    private Long expiration;

    public String generateToken(String email, Role role){
        Map<String, Object> claims = new HashMap<>();
        claims.put("role",role);
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .and()
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .compact();

    }
}
