package com.cabservice.repository;

import com.cabservice.entity.Trip;
import com.cabservice.entity.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByUserId(Long userId);

    long countByStatus(TripStatus status);
}