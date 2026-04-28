import apiClient from './client';
import { ApiResponse, ProfileSummaryDto } from './types';

export const addToShortlist = (profileId: string) =>
  apiClient.post<ApiResponse<void>>(`/shortlist/${profileId}`);

export const removeFromShortlist = (profileId: string) =>
  apiClient.delete<ApiResponse<void>>(`/shortlist/${profileId}`);

export const getShortlist = () =>
  apiClient.get<ApiResponse<ProfileSummaryDto[]>>('/shortlist');
