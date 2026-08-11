package com.cabservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "trips")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private Double distance;

    @Column(nullable = false)
    private Double fare;

    @Column(nullable = false)
    private LocalDateTime pickupDate;

    private LocalDateTime returnDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime createdAt;
}