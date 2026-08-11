package com.cabservice.service.impl;

import com.cabservice.dto.request.TripRequestDTO;
import com.cabservice.dto.response.TripResponseDTO;
import com.cabservice.entity.Trip;
import com.cabservice.entity.TripStatus;
import com.cabservice.entity.User;
import com.cabservice.exception.TripNotFoundException;
import com.cabservice.exception.UserNotFoundException;
import com.cabservice.mapper.TripMapper;
import com.cabservice.repository.TripRepository;
import com.cabservice.repository.UserRepository;
import com.cabservice.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Override
    public TripResponseDTO bookTrip(TripRequestDTO request) {

        User user = userRepository.findById(request.getUserId())
                                  .orElseThrow(() ->
                                          new UserNotFoundException(
                                                  "User not found with id: " + request.getUserId()
                                          ));

        Double distance = 10.0;

        Double baseFare = 50.0;
        Double pricePerKm = 20.0;

        Double fare = baseFare + (distance * pricePerKm);

        Trip trip = Trip.builder()
                        .user(user)
                        .origin(request.getOrigin())
                        .destination(request.getDestination())
                        .distance(distance)
                        .fare(fare)
                        .pickupDate(request.getPickupDate())
                        .returnDate(request.getReturnDate())
                        .status(TripStatus.BOOKED)
                        .createdAt(LocalDateTime.now())
                        .build();

        Trip savedTrip = tripRepository.save(trip);

        return TripMapper.toDTO(savedTrip);
    }

    @Override
    public TripResponseDTO getTripById(Long tripId) {

        Trip trip = tripRepository.findById(tripId)
                                  .orElseThrow(() ->
                                          new TripNotFoundException(
                                                  "Trip not found with id: " + tripId
                                          ));

        return TripMapper.toDTO(trip);
    }

    @Override
    public List<TripResponseDTO> getTripsByUser(Long userId) {

        if(! userRepository.existsById(userId)) {
            throw new UserNotFoundException(
                    "User not found with id: " + userId
            );
        }

        return tripRepository.findByUserId(userId)
                             .stream()
                             .map(TripMapper :: toDTO)
                             .toList();
    }
}