package com.sajjanmatrimony.repository;

import com.sajjanmatrimony.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProfileRepository extends MongoRepository<Profile, String> {
    Optional<Profile> findByUserId(String userId);
    boolean existsByUserId(String userId);
    Page<Profile> findByApprovedTrue(Pageable pageable);
    Page<Profile> findByApprovedFalse(Pageable pageable);
}
