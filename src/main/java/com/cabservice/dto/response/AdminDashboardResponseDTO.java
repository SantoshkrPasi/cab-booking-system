package com.cabservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponseDTO {

    private Long totalUsers;

    private Long totalTrips;

    private Long bookedTrips;

    private Long completedTrips;

    private Long cancelledTrips;

    private Double totalRevenue;
}