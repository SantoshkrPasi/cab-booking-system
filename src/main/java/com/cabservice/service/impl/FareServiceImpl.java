package com.cabservice.service.impl;

import com.cabservice.service.FareService;
import org.springframework.stereotype.Service;

@Service
public class FareServiceImpl implements FareService {

    private static final double BASE_FARE = 50.0;

    private static final double PRICE_PER_KM = 20.0;

    @Override
    public Double calculateFare(Double distance) {

        double fare =
                BASE_FARE + (distance * PRICE_PER_KM);

        return Math.round(fare * 100.0) / 100.0;
    }
}