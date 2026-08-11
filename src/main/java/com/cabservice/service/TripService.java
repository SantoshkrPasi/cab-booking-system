package com.cabservice.service;

import com.cabservice.dto.request.TripRequestDTO;
import com.cabservice.dto.response.TripResponseDTO;

import java.util.List;

public interface TripService {

    TripResponseDTO bookTrip(TripRequestDTO request);

    TripResponseDTO getTripById(Long tripId);

    List<TripResponseDTO> getTripsByUser(Long userId);
}