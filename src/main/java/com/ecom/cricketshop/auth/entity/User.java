package com.ecom.cricketshop.auth.entity;

import com.ecom.cricketshop.auth.Role;
import com.ecom.cricketshop.product.entity.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users", uniqueConstraints ={
        @UniqueConstraint(columnNames = "email")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String name;
    @Pattern(
            regexp = "^[A-Za-z0-9+_.-]+@gmail\\.com$",
            message = "Email must be a valid Gmail address"
    )
    private String email;
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d).{8,}$",
            message = "Password must be at least 8 characters, include one uppercase letter, one number, and one special character"
    )
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
