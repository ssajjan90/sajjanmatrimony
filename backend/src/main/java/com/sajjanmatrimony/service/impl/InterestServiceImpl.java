package com.sajjanmatrimony.service.impl;

import com.sajjanmatrimony.entity.Interest;
import com.sajjanmatrimony.entity.Profile;
import com.sajjanmatrimony.entity.enums.InterestStatus;
import com.sajjanmatrimony.exception.AppException;
import com.sajjanmatrimony.exception.DuplicateResourceException;
import com.sajjanmatrimony.exception.ResourceNotFoundException;
import com.sajjanmatrimony.repository.InterestRepository;
import com.sajjanmatrimony.repository.ProfileRepository;
import com.sajjanmatrimony.service.InterestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InterestServiceImpl implements InterestService {

    private final InterestRepository interestRepository;
    private final ProfileRepository profileRepository;

    @Override
    public Interest expressInterest(String senderId, String receiverProfileId, String message) {
        Profile receiverProfile = profileRepository.findById(receiverProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", receiverProfileId));

        if (!receiverProfile.isApproved()) {
            throw new AppException("Cannot send interest to an unapproved profile", HttpStatus.BAD_REQUEST);
        }
        if (senderId.equals(receiverProfile.getUserId())) {
            throw new AppException("Cannot send interest to your own profile", HttpStatus.BAD_REQUEST);
        }
        if (interestRepository.existsBySenderIdAndReceiverId(senderId, receiverProfile.getUserId())) {
            throw new DuplicateResourceException("Interest already sent to this profile");
        }

        return interestRepository.save(Interest.builder()
                .senderId(senderId)
                .receiverId(receiverProfile.getUserId())
                .message(message)
                .status(InterestStatus.PENDING)
                .build());
    }

    @Override
    public Interest updateInterestStatus(String receiverId, String interestId, String status) {
        Interest interest = interestRepository.findById(interestId)
                .orElseThrow(() -> new ResourceNotFoundException("Interest", interestId));

        if (!interest.getReceiverId().equals(receiverId)) {
            throw new AppException("Not authorized to update this interest", HttpStatus.FORBIDDEN);
        }
        interest.setStatus(InterestStatus.valueOf(status.toUpperCase()));
        return interestRepository.save(interest);
    }

    @Override
    public List<Interest> getSentInterests(String userId) {
        return interestRepository.findBySenderId(userId);
    }

    @Override
    public List<Interest> getReceivedInterests(String userId) {
        return interestRepository.findByReceiverId(userId);
    }
}
