package com.ecom.cricketshop.auth.repo;

import com.ecom.cricketshop.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    public Optional<User> findByEmail(String email);

    public boolean existsByEmail(String email);


}
