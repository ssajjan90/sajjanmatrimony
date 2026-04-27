package com.sajjanmatrimony.service;

import com.sajjanmatrimony.entity.Interest;

import java.util.List;

public interface InterestService {
    Interest expressInterest(String senderId, String receiverProfileId, String message);
    Interest updateInterestStatus(String receiverId, String interestId, String status);
    List<Interest> getSentInterests(String userId);
    List<Interest> getReceivedInterests(String userId);
}
