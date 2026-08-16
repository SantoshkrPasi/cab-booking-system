package com.cabservice.controller;

import com.cabservice.dto.ApiResponse;
import com.cabservice.dto.request.TripRequestDTO;
import com.cabservice.dto.response.TripResponseDTO;
import com.cabservice.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<ApiResponse<TripResponseDTO>> bookTrip(@Valid @RequestBody TripRequestDTO request) {

        return ResponseEntity.status(201)
                             .body(new ApiResponse<>(true, "Trip booked successfully", tripService.bookTrip(request)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<TripResponseDTO>>> getMyTrips() {

        return ResponseEntity.status(200)
                             .body(new ApiResponse<>(true, "Trips fetched successfully", tripService.getMyTrips()));
    }

    @GetMapping("/my/{tripId}")
    public ResponseEntity<ApiResponse<TripResponseDTO>> getMyTrip(@PathVariable Long tripId) {

        return ResponseEntity.status(200)
                             .body(new ApiResponse<>(true, "Trip fetched successfully",
                                     tripService.getMyTripById(tripId)));
    }

    @PatchMapping("/my/{tripId}/cancel")
    public ResponseEntity<ApiResponse<TripResponseDTO>> cancelTrip(@PathVariable Long tripId) {

        return ResponseEntity.status(200)
                             .body(new ApiResponse<>(true, "Trip cancelled successfully",
                                     tripService.cancelMyTrip(tripId)));
    }

}