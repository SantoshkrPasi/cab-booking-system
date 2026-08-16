package com.cabservice.service.impl;

import com.cabservice.dto.external.GeoapifyGeocodingResponse;
import com.cabservice.dto.external.GeoapifyRoutingResponse;
import com.cabservice.exception.BadRequestException;
import com.cabservice.service.DistanceService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class DistanceServiceImpl implements DistanceService {

    private final RestClient restClient;

    @Value("${geoapify.api-key}")
    private String apiKey;

    @Value("${geoapify.geocoding-url}")
    private String geocodingUrl;

    @Value("${geoapify.routing-url}")
    private String routingUrl;

    public DistanceServiceImpl(RestClient.Builder restClientBuilder) {

        this.restClient = restClientBuilder.build();
    }

    @Override
    public Double calculateDistance(String origin, String destination) {

        Coordinates originCoordinates = getCoordinates(origin);

        Coordinates destinationCoordinates = getCoordinates(destination);

        return getRouteDistance(originCoordinates, destinationCoordinates);
    }

    private Coordinates getCoordinates(String address) {

        String url = geocodingUrl + "?text={address}" + "&filter=countrycode:in" + "&limit=1" + "&apiKey={apiKey}";

        try {

            GeoapifyGeocodingResponse response = restClient.get()
                                                           .uri(url, address, apiKey)
                                                           .retrieve()
                                                           .body(GeoapifyGeocodingResponse.class);

            if(response == null || response.getFeatures() == null || response.getFeatures().isEmpty()) {

                throw new BadRequestException("Location not found: " + address);
            }

            GeoapifyGeocodingResponse.Properties properties = response.getFeatures().get(0).getProperties();

            if(properties == null || properties.getLat() == null || properties.getLon() == null) {

                throw new BadRequestException("Unable to get coordinates for: " + address);
            }

            System.out.println(
                    "Geocoded location: " + address + " -> lat=" + properties.getLat() + ", lon=" + properties.getLon());

            return new Coordinates(properties.getLat(), properties.getLon());

        } catch(BadRequestException exception) {

            throw exception;

        } catch(Exception exception) {

            exception.printStackTrace();

            throw new BadRequestException("Unable to geocode location: " + address);
        }
    }

    private Double getRouteDistance(Coordinates origin, Coordinates destination) {

        String waypoints = origin.latitude() + "," + origin.longitude() + "|" + destination.latitude() + "," + destination.longitude();

        String url = routingUrl + "?waypoints=" + waypoints + "&mode=drive" + "&format=geojson" + "&apiKey=" + apiKey;

        System.out.println("Geoapify routing waypoints: " + waypoints);

        System.out.println("Geoapify Routing URL: " + url.replace(apiKey, "HIDDEN_API_KEY"));

        try {

            GeoapifyRoutingResponse response = restClient.get().uri(url).retrieve().body(GeoapifyRoutingResponse.class);

            if(response == null || response.getFeatures() == null || response.getFeatures().isEmpty()) {

                throw new BadRequestException("No driving route found between origin and destination");
            }

            GeoapifyRoutingResponse.Properties properties = response.getFeatures().get(0).getProperties();

            if(properties == null || properties.getDistance() == null) {

                throw new BadRequestException("Distance not available");
            }

            Double distanceMeters = properties.getDistance();

            double distanceKm = distanceMeters / 1000.0;

            return Math.round(distanceKm * 100.0) / 100.0;

        } catch(BadRequestException exception) {

            throw exception;

        } catch(Exception exception) {

            exception.printStackTrace();

            System.out.println("Geoapify routing failed for: " + waypoints);

            throw new BadRequestException("Unable to find a driving route between origin and destination");
        }
    }

    private record Coordinates(Double latitude, Double longitude) {

    }
}