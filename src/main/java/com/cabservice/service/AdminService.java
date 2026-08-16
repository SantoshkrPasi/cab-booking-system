package com.cabservice.service;

import com.cabservice.dto.response.AdminDashboardResponseDTO;
import com.cabservice.dto.response.TripResponseDTO;
import com.cabservice.dto.response.UserResponseDTO;
import com.cabservice.entity.TripStatus;

import java.util.List;

public interface AdminService {

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long userId);

    List<TripResponseDTO> getAllTrips();

    TripResponseDTO getTripById(Long tripId);

    AdminDashboardResponseDTO getDashboardStatistics();

    TripResponseDTO updateTripStatus(Long tripId, TripStatus status);
}