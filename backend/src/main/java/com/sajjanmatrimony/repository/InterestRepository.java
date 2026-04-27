package com.sajjanmatrimony.repository;

import com.sajjanmatrimony.entity.Interest;
import com.sajjanmatrimony.entity.enums.InterestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InterestRepository extends MongoRepository<Interest, String> {
    List<Interest> findBySenderId(String senderId);
    List<Interest> findByReceiverId(String receiverId);
    List<Interest> findByReceiverIdAndStatus(String receiverId, InterestStatus status);
    Optional<Interest> findBySenderIdAndReceiverId(String senderId, String receiverId);
    boolean existsBySenderIdAndReceiverId(String senderId, String receiverId);
}
