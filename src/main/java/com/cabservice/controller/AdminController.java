package com.cabservice.controller;

import com.cabservice.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<String>> dashboard() {

        return ResponseEntity
                .status(200)
                .body(
                        new ApiResponse<>(
                                true,
                                "Admin access granted",
                                "Welcome to Admin Dashboard"
                        )
                );
    }
}