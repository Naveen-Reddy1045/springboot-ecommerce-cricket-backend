package com.ecom.cricketshop.address.controller;

import com.ecom.cricketshop.address.entity.Address;
import com.ecom.cricketshop.address.service.AddressService;
import com.ecom.cricketshop.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buyer/address")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping
    public ResponseEntity<ApiResponse<Address>> addAddress(@Valid @RequestBody Address address) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(addressService.addAddress(address));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Address>>> getMyAddresses() {
        return ResponseEntity.ok(addressService.getMyAddresses());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAddress(@PathVariable Long id) {
        return ResponseEntity.ok(addressService.deleteAddress(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Address>> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody Address address) {

        return ResponseEntity.ok(addressService.updateAddress(id, address));
    }
}
