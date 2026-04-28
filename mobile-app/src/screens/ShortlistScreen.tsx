import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import ProfileCard from '../components/ProfileCard';
import EmptyState from '../components/EmptyState';
import { getShortlist, removeFromShortlist } from '../api/shortlist.api';
import { ProfileSummaryDto } from '../api/types';
import type { MainNavProp } from '../navigation/types';

export default function ShortlistScreen() {
  const navigation = useNavigation<MainNavProp>();
  const [profiles, setProfiles] = useState<ProfileSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getShortlist();
      setProfiles(res.data.data ?? []);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const handleRemove = (profileId: string) => {
    Alert.alert('Remove', 'Remove from shortlist?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeFromShortlist(profileId);
            setProfiles((prev) => prev.filter((p) => p.id !== profileId));
          } catch (err: any) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(); }}
            colors={[Colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            onPress={() => navigation.navigate('ProfileDetails', { profileId: item.id })}
            onShortlist={() => handleRemove(item.id)}
            isShortlisted
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="star-outline"
              title="No shortlisted profiles"
              subtitle="Tap the star icon on any profile to save them here for easy access."
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 14 },
});
