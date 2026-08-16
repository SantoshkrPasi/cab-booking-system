package com.cabservice.repository;

import com.cabservice.entity.OtpPurpose;
import com.cabservice.entity.OtpType;
import com.cabservice.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpVerificationRepository
        extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification>
    findTopByIdentifierAndTypeAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(
            String identifier,
            OtpType type,
            OtpPurpose purpose
    );

    Optional<OtpVerification>
    findTopByIdentifierAndTypeAndPurposeAndVerifiedTrueOrderByCreatedAtDesc(
            String identifier,
            OtpType type,
            OtpPurpose purpose
    );

}