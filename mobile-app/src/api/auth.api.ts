import apiClient from './client';
import { ApiResponse, LoginRequest, LoginResponse, RegisterRequest, UserResponse } from './types';

export const register = (data: RegisterRequest) =>
  apiClient.post<ApiResponse<UserResponse>>('/auth/register', data);

export const login = (data: LoginRequest) =>
  apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);

export const refreshToken = (token: string) =>
  apiClient.post<ApiResponse<LoginResponse>>(`/auth/refresh?refreshToken=${token}`);
