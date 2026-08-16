package com.cabservice.service.impl;

import com.cabservice.dto.response.AdminDashboardResponseDTO;
import com.cabservice.dto.response.TripResponseDTO;
import com.cabservice.dto.response.UserResponseDTO;
import com.cabservice.entity.Trip;
import com.cabservice.entity.TripStatus;
import com.cabservice.entity.User;
import com.cabservice.exception.BadRequestException;
import com.cabservice.exception.TripNotFoundException;
import com.cabservice.exception.UserNotFoundException;
import com.cabservice.mapper.TripMapper;
import com.cabservice.mapper.UserMapper;
import com.cabservice.repository.TripRepository;
import com.cabservice.repository.UserRepository;
import com.cabservice.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;

    private final UserMapper userMapper;

    @Override
    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll().stream().map(userMapper :: toDTO).toList();
    }

    @Override
    public UserResponseDTO getUserById(Long userId) {

        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        return userMapper.toDTO(user);
    }

    @Override
    public List<TripResponseDTO> getAllTrips() {

        return tripRepository.findAll().stream().map(TripMapper :: toDTO).toList();
    }

    @Override
    public TripResponseDTO getTripById(Long tripId) {

        Trip trip = tripRepository.findById(tripId)
                                  .orElseThrow(() -> new TripNotFoundException("Trip not found with id: " + tripId));

        return TripMapper.toDTO(trip);
    }

    @Override
    public AdminDashboardResponseDTO getDashboardStatistics() {

        long totalUsers = userRepository.count();

        long totalTrips = tripRepository.count();

        long bookedTrips = tripRepository.countByStatus(TripStatus.BOOKED);

        long completedTrips = tripRepository.countByStatus(TripStatus.COMPLETED);

        long cancelledTrips = tripRepository.countByStatus(TripStatus.CANCELLED);

        double totalRevenue = tripRepository.findAll()
                                            .stream()
                                            .filter(trip -> trip.getStatus() == TripStatus.COMPLETED)
                                            .mapToDouble(Trip :: getFare)
                                            .sum();

        return AdminDashboardResponseDTO.builder()
                                        .totalUsers(totalUsers)
                                        .totalTrips(totalTrips)
                                        .bookedTrips(bookedTrips)
                                        .completedTrips(completedTrips)
                                        .cancelledTrips(cancelledTrips)
                                        .totalRevenue(totalRevenue)
                                        .build();
    }

    @Override
    public TripResponseDTO updateTripStatus(Long tripId, TripStatus status) {

        Trip trip = tripRepository.findById(tripId)
                                  .orElseThrow(
                                          () -> new TripNotFoundException("Trip not found with id: " + tripId));

        if(trip.getStatus() != TripStatus.BOOKED) {

            throw new BadRequestException("Only booked trips can be updated");
        }

        if(status != TripStatus.COMPLETED && status != TripStatus.CANCELLED) {

            throw new BadRequestException("Trip can only be completed or cancelled");
        }

        trip.setStatus(status);

        Trip savedTrip = tripRepository.save(trip);

        return TripMapper.toDTO(savedTrip);
    }

}