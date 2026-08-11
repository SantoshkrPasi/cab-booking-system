package com.cabservice.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TripRequestDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Origin is required")
    private String origin;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Pickup date is required")
    @FutureOrPresent(message = "Pickup date must be today or in the future")
    private LocalDateTime pickupDate;

    private LocalDateTime returnDate;
}