package com.cabservice.service.impl;

import com.cabservice.dto.response.TripResponseDTO;
import com.cabservice.dto.response.UserResponseDTO;
import com.cabservice.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class AdminServiceImpl implements AdminService {

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return List.of();
    }

    @Override
    public UserResponseDTO getUserById(Long userId) {
        return null;
    }

    @Override
    public List<TripResponseDTO> getAllTrips() {
        return List.of();
    }

    @Override
    public TripResponseDTO getTripById(Long tripId) {
        return null;
    }
}
