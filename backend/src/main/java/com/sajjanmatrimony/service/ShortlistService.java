package com.sajjanmatrimony.service;

import com.sajjanmatrimony.dto.response.ProfileSummaryDto;

import java.util.List;

public interface ShortlistService {
    void addToShortlist(String userId, String profileId);
    void removeFromShortlist(String userId, String profileId);
    List<ProfileSummaryDto> getShortlist(String userId);
}
