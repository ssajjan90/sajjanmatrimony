import apiClient from './client';
import { ApiResponse, Interest } from './types';

export const expressInterest = (profileId: string, message?: string) =>
  apiClient.post<ApiResponse<Interest>>(
    `/interests/${profileId}`,
    null,
    { params: message ? { message } : {} }
  );

export const updateInterestStatus = (interestId: string, status: 'ACCEPTED' | 'REJECTED') =>
  apiClient.patch<ApiResponse<Interest>>(`/interests/${interestId}`, { status });

export const getSentInterests = () =>
  apiClient.get<ApiResponse<Interest[]>>('/interests/sent');

export const getReceivedInterests = () =>
  apiClient.get<ApiResponse<Interest[]>>('/interests/received');
