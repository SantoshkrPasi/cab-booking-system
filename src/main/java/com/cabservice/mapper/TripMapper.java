package com.cabservice.mapper;

import com.cabservice.dto.response.TripResponseDTO;
import com.cabservice.entity.Trip;

public class TripMapper {

    public static TripResponseDTO toDTO(Trip trip) {

        TripResponseDTO dto = new TripResponseDTO();
        dto.setId(trip.getId());
        dto.setUserId(trip.getUser().getId());
        dto.setOrigin(trip.getOrigin());
        dto.setDestination(trip.getDestination());
        dto.setDistance(trip.getDistance());
        dto.setFare(trip.getFare());
        dto.setPickupDate(trip.getPickupDate());
        dto.setReturnDate(trip.getReturnDate());
        dto.setStatus(trip.getStatus());
        dto.setCreatedAt(trip.getCreatedAt());

        return dto;
    }
}