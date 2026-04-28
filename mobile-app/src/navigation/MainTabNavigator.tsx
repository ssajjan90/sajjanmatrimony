import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { TabParamList } from './types';
import ProfileListScreen from '../screens/profile/ProfileListScreen';
import InterestsScreen from '../screens/InterestsScreen';
import ShortlistScreen from '../screens/ShortlistScreen';
import MyProfileScreen from '../screens/profile/MyProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const tabIcon =
  (active: IoniconsName, inactive: IoniconsName) =>
  ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <Ionicons name={focused ? active : inactive} size={size} color={color} />
  );

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: { borderTopWidth: 1, borderTopColor: Colors.border, height: 60, paddingBottom: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={ProfileListScreen}
        options={{
          title: 'Discover',
          tabBarIcon: tabIcon('search', 'search-outline'),
        }}
      />
      <Tab.Screen
        name="InterestsTab"
        component={InterestsScreen}
        options={{
          title: 'Interests',
          tabBarIcon: tabIcon('heart', 'heart-outline'),
        }}
      />
      <Tab.Screen
        name="ShortlistTab"
        component={ShortlistScreen}
        options={{
          title: 'Shortlist',
          tabBarIcon: tabIcon('star', 'star-outline'),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={MyProfileScreen}
        options={{
          title: 'My Profile',
          tabBarIcon: tabIcon('person', 'person-outline'),
        }}
      />
    </Tab.Navigator>
  );
}
