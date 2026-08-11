package com.cabservice.controller;

import com.cabservice.dto.ApiResponse;
import com.cabservice.dto.request.TripRequestDTO;
import com.cabservice.dto.response.TripResponseDTO;
import com.cabservice.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<ApiResponse<TripResponseDTO>> bookTrip(
            @Valid @RequestBody TripRequestDTO request) {

        TripResponseDTO response = tripService.bookTrip(request);

        ApiResponse<TripResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Trip booked successfully",
                        response
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(apiResponse);
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<ApiResponse<TripResponseDTO>> getTrip(
            @PathVariable Long tripId) {

        TripResponseDTO response = tripService.getTripById(tripId);

        ApiResponse<TripResponseDTO> apiResponse =
                new ApiResponse<>(
                        true,
                        "Trip fetched successfully",
                        response
                );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TripResponseDTO>>> getUserTrips(
            @PathVariable Long userId) {

        List<TripResponseDTO> response =
                tripService.getTripsByUser(userId);

        ApiResponse<List<TripResponseDTO>> apiResponse =
                new ApiResponse<>(
                        true,
                        "User trips fetched successfully",
                        response
                );

        return ResponseEntity.ok(apiResponse);
    }
}