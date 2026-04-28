import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { MainStackParamList } from './types';
import MainTabNavigator from './MainTabNavigator';
import CreateProfileScreen from '../screens/profile/CreateProfileScreen';
import ProfileDetailsScreen from '../screens/profile/ProfileDetailsScreen';
import SearchFilterScreen from '../screens/profile/SearchFilterScreen';
import { useAuthStore } from '../store/useAuthStore';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  const hasProfile = useAuthStore((s) => s.hasProfile);

  return (
    <Stack.Navigator
      initialRouteName={hasProfile ? 'MainTabs' : 'CreateProfile'}
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="CreateProfile"
        component={CreateProfileScreen}
        options={({ route }) => ({
          title: route.params?.isEdit ? 'Edit Profile' : 'Create Profile',
          headerLeft: route.params?.isEdit ? undefined : () => null,
        })}
      />
      <Stack.Screen
        name="ProfileDetails"
        component={ProfileDetailsScreen}
        options={{ title: 'Profile Details' }}
      />
      <Stack.Screen
        name="SearchFilter"
        component={SearchFilterScreen}
        options={{ title: 'Filter Profiles', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
