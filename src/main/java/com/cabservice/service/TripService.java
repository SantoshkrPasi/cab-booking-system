package com.cabservice.service;

import com.cabservice.dto.request.TripRequestDTO;
import com.cabservice.dto.response.TripResponseDTO;

import java.util.List;

public interface TripService {


    TripResponseDTO bookTrip(TripRequestDTO request);

    TripResponseDTO getMyTripById(Long tripId);

    List<TripResponseDTO> getMyTrips();

    TripResponseDTO cancelMyTrip(Long tripId);

}