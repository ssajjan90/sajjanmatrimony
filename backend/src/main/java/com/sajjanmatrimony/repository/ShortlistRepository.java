package com.sajjanmatrimony.repository;

import com.sajjanmatrimony.entity.Shortlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ShortlistRepository extends MongoRepository<Shortlist, String> {
    List<Shortlist> findByUserId(String userId);
    Optional<Shortlist> findByUserIdAndProfileId(String userId, String profileId);
    boolean existsByUserIdAndProfileId(String userId, String profileId);

    @Transactional
    void deleteByUserIdAndProfileId(String userId, String profileId);
}
