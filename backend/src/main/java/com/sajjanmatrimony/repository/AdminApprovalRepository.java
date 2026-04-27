package com.sajjanmatrimony.repository;

import com.sajjanmatrimony.entity.AdminApproval;
import com.sajjanmatrimony.entity.enums.ApprovalStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AdminApprovalRepository extends MongoRepository<AdminApproval, String> {
    Optional<AdminApproval> findByProfileId(String profileId);
    List<AdminApproval> findByStatus(ApprovalStatus status);
}
