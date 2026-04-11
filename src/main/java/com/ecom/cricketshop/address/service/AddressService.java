package com.ecom.cricketshop.address.service;

import com.ecom.cricketshop.address.entity.Address;
import com.ecom.cricketshop.address.repo.AddressRepository;
import com.ecom.cricketshop.auth.entity.User;
import com.ecom.cricketshop.auth.repo.UserRepository;
import com.ecom.cricketshop.common.ApiResponse;
import com.ecom.cricketshop.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    public ApiResponse<Address> addAddress(Address address) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        address.setUser(user);

        // Handle default address logic
        if (address.isDefault()) {
            List<Address> existing = addressRepository.findByUser(user);
            existing.forEach(a -> a.setDefault(false));
            addressRepository.saveAll(existing);
        }

        Address saved = addressRepository.save(address);

        return new ApiResponse<>(
                true,
                "Address added successfully",
                saved
        );
    }

    public ApiResponse<List<Address>> getMyAddresses() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Address> addresses = addressRepository.findByUser(user);

        return new ApiResponse<>(
                true,
                "Addresses fetched successfully",
                addresses
        );
    }

    public ApiResponse<String> deleteAddress(Long id) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        addressRepository.delete(address);

        return new ApiResponse<>(
                true,
                "Address deleted successfully",
                null
        );
    }

    public ApiResponse<Address> updateAddress(Long id, Address updatedAddress) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        address.setFullName(updatedAddress.getFullName());
        address.setPhoneNumber(updatedAddress.getPhoneNumber());
        address.setAddressLine(updatedAddress.getAddressLine());
        address.setCity(updatedAddress.getCity());
        address.setState(updatedAddress.getState());
        address.setPincode(updatedAddress.getPincode());

        if (updatedAddress.isDefault()) {
            List<Address> existing = addressRepository.findByUser(user);
            existing.forEach(a -> a.setDefault(false));
            addressRepository.saveAll(existing);
            address.setDefault(true);
        }

        Address saved = addressRepository.save(address);

        return new ApiResponse<>(
                true,
                "Address updated successfully",
                saved
        );
    }
}
