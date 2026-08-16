package com.cabservice.service.impl;

import com.cabservice.dto.request.TripRequestDTO;
import com.cabservice.dto.response.TripResponseDTO;
import com.cabservice.entity.Trip;
import com.cabservice.entity.TripStatus;
import com.cabservice.entity.User;
import com.cabservice.exception.BadRequestException;
import com.cabservice.exception.TripNotFoundException;
import com.cabservice.mapper.TripMapper;
import com.cabservice.repository.TripRepository;
import com.cabservice.repository.UserRepository;
import com.cabservice.security.CurrentUserService;
import com.cabservice.service.DistanceService;
import com.cabservice.service.FareService;
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
    private final DistanceService distanceService;
    private final FareService fareService;
    private final CurrentUserService currentUserService;

    @Override
    public TripResponseDTO bookTrip(TripRequestDTO request) {

        if(request.getOrigin().trim()
                  .equalsIgnoreCase(request.getDestination().trim())) {

            throw new BadRequestException(
                    "Origin and destination cannot be the same"
            );
        }

        if(request.getReturnDate() != null &&
                request.getReturnDate()
                       .isBefore(request.getPickupDate())) {

            throw new BadRequestException(
                    "Return date cannot be before pickup date"
            );
        }

        User user = currentUserService.getCurrentUser();

        Double distance =
                distanceService.calculateDistance(
                        request.getOrigin(),
                        request.getDestination()
                );

        Double fare =
                fareService.calculateFare(distance);

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
    public List<TripResponseDTO> getMyTrips() {

        User currentUser =
                currentUserService.getCurrentUser();

        return tripRepository
                .findByUserId(currentUser.getId())
                .stream()
                .map(TripMapper :: toDTO)
                .toList();
    }

    @Override
    public TripResponseDTO getMyTripById(Long tripId) {

        User currentUser =
                currentUserService.getCurrentUser();

        Trip trip = tripRepository.findById(tripId)
                                  .orElseThrow(() ->
                                          new TripNotFoundException(
                                                  "Trip not found with id: " + tripId
                                          )
                                  );

        if(! trip.getUser()
                 .getId()
                 .equals(currentUser.getId())) {

            throw new BadRequestException(
                    "You are not allowed to access this trip"
            );
        }

        return TripMapper.toDTO(trip);
    }

    @Override
    public TripResponseDTO cancelMyTrip(Long tripId) {

        User currentUser =
                currentUserService.getCurrentUser();

        Trip trip = tripRepository.findById(tripId)
                                  .orElseThrow(() ->
                                          new TripNotFoundException(
                                                  "Trip not found with id: " + tripId
                                          )
                                  );

        if(! trip.getUser()
                 .getId()
                 .equals(currentUser.getId())) {

            throw new BadRequestException(
                    "You are not allowed to cancel this trip"
            );
        }

        if(trip.getStatus() != TripStatus.BOOKED) {
            throw new BadRequestException(
                    "Only booked trips can be cancelled"
            );
        }

        trip.setStatus(TripStatus.CANCELLED);

        Trip savedTrip = tripRepository.save(trip);

        return TripMapper.toDTO(savedTrip);
    }
}