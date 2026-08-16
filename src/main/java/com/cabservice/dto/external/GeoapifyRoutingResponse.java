package com.cabservice.dto.external;

import lombok.Data;

import java.util.List;

@Data
public class GeoapifyRoutingResponse {

    private List<Feature> features;

    @Data
    public static class Feature {

        private Properties properties;
    }

    @Data
    public static class Properties {

        private Double distance;
    }
}