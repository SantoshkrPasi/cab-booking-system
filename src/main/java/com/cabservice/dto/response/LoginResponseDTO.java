package com.cabservice.dto.response;
import lombok.Data;

@Data
public class LoginResponseDTO {
    private Long userId;

    private String firstName;

    private String email;

    private String message;

}
