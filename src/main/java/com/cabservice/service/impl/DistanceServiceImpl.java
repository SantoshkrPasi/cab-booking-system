package com.cabservice.service.impl;

import com.cabservice.service.DistanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class DistanceServiceImpl implements DistanceService {

    @Override
    public Double calculateDistance(String origin, String destination) {
        return 0.0;
    }
}
