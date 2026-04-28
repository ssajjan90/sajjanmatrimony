export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  emailVerified: boolean;
  mobileVerified: boolean;
  blocked: boolean;
  active: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserResponse;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  gender: string;
}

export interface LoginRequest {
  emailOrMobile: string;
  password: string;
}

export interface ProfileRequest {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  height?: string;
  maritalStatus: string;
  motherTongue?: string;
  caste?: string;
  education: string;
  occupation: string;
  annualIncome?: string;
  city: string;
  nativePlace?: string;
  aboutMe?: string;
  partnerPreferences?: Record<string, unknown>;
  additionalDetails?: Record<string, unknown>;
}

export interface ProfileResponse {
  id: string;
  userId: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  height?: string;
  maritalStatus: string;
  motherTongue?: string;
  caste?: string;
  education: string;
  occupation: string;
  annualIncome?: string;
  city: string;
  nativePlace?: string;
  aboutMe?: string;
  partnerPreferences?: Record<string, unknown>;
  photoUrls: string[];
  approved: boolean;
  additionalDetails?: Record<string, unknown>;
  createdAt: string;
}

export interface ProfileSummaryDto {
  id: string;
  fullName: string;
  gender: string;
  age: number;
  height?: string;
  maritalStatus: string;
  city: string;
  education: string;
  occupation: string;
  caste?: string;
  profilePhoto?: string;
  approved: boolean;
}

export interface Interest {
  id: string;
  fromProfileId: string;
  toProfileId: string;
  fromUserName?: string;
  toUserName?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  createdAt: string;
}

export interface SearchFilters {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  city?: string;
  education?: string;
  occupation?: string;
  maritalStatus?: string;
  caste?: string;
}
