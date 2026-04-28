import apiClient from './client';
import {
  ApiResponse,
  PageResponse,
  ProfileRequest,
  ProfileResponse,
  ProfileSummaryDto,
  SearchFilters,
} from './types';

export const createProfile = (data: ProfileRequest) =>
  apiClient.post<ApiResponse<ProfileResponse>>('/profiles', data);

export const getMyProfile = () =>
  apiClient.get<ApiResponse<ProfileResponse>>('/profiles/me');

export const updateProfile = (data: ProfileRequest) =>
  apiClient.put<ApiResponse<ProfileResponse>>('/profiles/me', data);

export const getProfileById = (profileId: string) =>
  apiClient.get<ApiResponse<ProfileResponse>>(`/profiles/${profileId}`);

export const searchProfiles = (filters: SearchFilters, page = 0, size = 10) =>
  apiClient.get<ApiResponse<PageResponse<ProfileSummaryDto>>>('/profiles/search', {
    params: { ...filters, page, size },
  });
