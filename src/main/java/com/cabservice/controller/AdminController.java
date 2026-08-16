package com.cabservice.controller;

import com.cabservice.dto.ApiResponse;
import com.cabservice.dto.response.AdminDashboardResponseDTO;
import com.cabservice.dto.response.TripResponseDTO;
import com.cabservice.dto.response.UserResponseDTO;
import com.cabservice.entity.TripStatus;
import com.cabservice.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponseDTO>> getDashboard() {

        AdminDashboardResponseDTO dashboard = adminService.getDashboardStatistics();
        return ResponseEntity.status(200)
                             .body(new ApiResponse<>(true, "Dashboard statistics fetched successfully", dashboard));
    }


    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getAllUsers() {

        return ResponseEntity.status(200)
                             .body(new ApiResponse<>(true, "Users fetched successfully",
                                     adminService.getAllUsers()));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserById
            (@PathVariable Long userId) {

        return ResponseEntity.status(200)
                             .body(new ApiResponse<>(true, "User fetched successfully",
                                     adminService.getUserById(userId)));
    }

    @GetMapping("/trips")
    public ResponseEntity<ApiResponse<List<TripResponseDTO>>> getAllTrips() {

        return ResponseEntity.status(200)
                             .body(new ApiResponse<>(true, "Trips fetched successfully",
                                     adminService.getAllTrips()));
    }

    @GetMapping("/trips/{tripId}")
    public ResponseEntity<ApiResponse<TripResponseDTO>> getTripById
            (@PathVariable Long tripId) {

        return ResponseEntity.status(200)
                             .body(new ApiResponse<>(true, "Trip fetched successfully",
                                     adminService.getTripById(tripId)));
    }

    @PatchMapping("/trips/{tripId}/status")
    public ResponseEntity<ApiResponse<TripResponseDTO>> updateTripStatus(@PathVariable Long tripId, @RequestParam TripStatus status) {

        return ResponseEntity.status(201).body(new ApiResponse<>(true, "Trip status updated successfully",
                adminService.updateTripStatus(tripId, status)));
    }
}