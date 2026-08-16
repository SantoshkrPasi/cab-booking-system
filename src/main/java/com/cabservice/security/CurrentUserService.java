package com.cabservice.security;

import com.cabservice.entity.User;
import com.cabservice.exception.UserNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    public User getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null || ! authentication.isAuthenticated() || ! (authentication.getPrincipal() instanceof User)) {

            throw new UserNotFoundException("Authenticated user not found");
        }

        return (User) authentication.getPrincipal();
    }
}