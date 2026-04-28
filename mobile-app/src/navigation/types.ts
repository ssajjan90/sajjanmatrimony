import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { SearchFilters } from '../api/types';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  CreateProfile: { isEdit?: boolean } | undefined;
  ProfileDetails: { profileId: string };
  SearchFilter: { currentFilters: SearchFilters; onApply: (f: SearchFilters) => void };
};

export type TabParamList = {
  HomeTab: undefined;
  InterestsTab: undefined;
  ShortlistTab: undefined;
  ProfileTab: undefined;
};

export type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainNavProp = NativeStackNavigationProp<MainStackParamList>;

export type HomeTabNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'HomeTab'>,
  NativeStackNavigationProp<MainStackParamList>
>;

export type ProfileDetailsRouteProp = RouteProp<MainStackParamList, 'ProfileDetails'>;
export type SearchFilterRouteProp = RouteProp<MainStackParamList, 'SearchFilter'>;
export type CreateProfileRouteProp = RouteProp<MainStackParamList, 'CreateProfile'>;
