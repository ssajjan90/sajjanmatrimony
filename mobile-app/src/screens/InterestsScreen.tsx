import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import InterestCard from '../components/InterestCard';
import EmptyState from '../components/EmptyState';
import { getSentInterests, getReceivedInterests, updateInterestStatus } from '../api/interest.api';
import { Interest } from '../api/types';
import type { MainNavProp } from '../navigation/types';

type Tab = 'received' | 'sent';

export default function InterestsScreen() {
  const navigation = useNavigation<MainNavProp>();
  const [activeTab, setActiveTab] = useState<Tab>('received');
  const [received, setReceived] = useState<Interest[]>([]);
  const [sent, setSent] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [recRes, sentRes] = await Promise.all([getReceivedInterests(), getSentInterests()]);
      setReceived(recRes.data.data ?? []);
      setSent(sentRes.data.data ?? []);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const handleUpdate = async (interestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await updateInterestStatus(interestId, status);
      setReceived((prev) =>
        prev.map((i) => (i.id === interestId ? { ...i, status } : i))
      );
      Alert.alert('Done', `Interest ${status.toLowerCase()}.`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const data = activeTab === 'received' ? received : sent;

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        {(['received', 'sent'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'received' ? `Received (${received.length})` : `Sent (${sent.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
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
          <InterestCard
            interest={item}
            type={activeTab}
            onAccept={() => handleUpdate(item.id, 'ACCEPTED')}
            onReject={() => handleUpdate(item.id, 'REJECTED')}
            onViewProfile={() => {
              const profileId = activeTab === 'received' ? item.fromProfileId : item.toProfileId;
              navigation.navigate('ProfileDetails', { profileId });
            }}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="heart-outline"
              title={activeTab === 'received' ? 'No interests received yet' : 'No interests sent yet'}
              subtitle={
                activeTab === 'received'
                  ? 'When someone shows interest in your profile, it will appear here.'
                  : 'Browse profiles and express your interest to connect.'
              }
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: Colors.primary },
  list: { padding: 14 },
});
