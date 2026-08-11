package com.cabservice.dto.response;

import com.cabservice.entity.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripResponseDTO {

    private Long id;

    private Long userId;

    private String origin;

    private String destination;

    private Double distance;

    private Double fare;

    private LocalDateTime pickupDate;

    private LocalDateTime returnDate;

    private TripStatus status;

    private LocalDateTime createdAt;
}