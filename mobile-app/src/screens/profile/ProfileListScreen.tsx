import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import ProfileCard from '../../components/ProfileCard';
import EmptyState from '../../components/EmptyState';
import { searchProfiles } from '../../api/profile.api';
import { addToShortlist, removeFromShortlist, getShortlist } from '../../api/shortlist.api';
import { ProfileSummaryDto, SearchFilters } from '../../api/types';
import type { HomeTabNavProp } from '../../navigation/types';

export default function ProfileListScreen() {
  const navigation = useNavigation<HomeTabNavProp>();
  const [profiles, setProfiles] = useState<ProfileSummaryDto[]>([]);
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<SearchFilters>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadProfiles = useCallback(async (reset = false) => {
    const currentPage = reset ? 0 : page;
    try {
      const activeFilters = { ...filters };
      if (search.trim()) activeFilters.city = search.trim();
      const res = await searchProfiles(activeFilters, currentPage, 10);
      const data = res.data.data!;
      setProfiles((prev) => (reset ? data.content : [...prev, ...data.content]));
      setHasMore(!data.last);
      if (reset) setPage(1);
      else setPage(currentPage + 1);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, search, page]);

  useEffect(() => { loadProfiles(true); }, [filters]);

  const loadShortlist = async () => {
    try {
      const res = await getShortlist();
      setShortlisted(new Set(res.data.data?.map((p) => p.id) ?? []));
    } catch { /* ignore */ }
  };

  useEffect(() => { loadShortlist(); }, []);

  const toggleShortlist = async (profileId: string) => {
    try {
      if (shortlisted.has(profileId)) {
        await removeFromShortlist(profileId);
        setShortlisted((s) => { const n = new Set(s); n.delete(profileId); return n; });
      } else {
        await addToShortlist(profileId);
        setShortlisted((s) => new Set(s).add(profileId));
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProfiles(true);
  };

  const applyFilters = (f: SearchFilters) => {
    setFilters(f);
    setPage(0);
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by city..."
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => loadProfiles(true)}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(''); loadProfiles(true); }}>
              <Ionicons name="close-circle" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() =>
            navigation.navigate('SearchFilter', {
              currentFilters: filters,
              onApply: applyFilters,
            })
          }
        >
          <Ionicons name="options-outline" size={22} color={Colors.primary} />
          {Object.keys(filters).length > 0 && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      {/* Active filter chips */}
      {Object.keys(filters).length > 0 && (
        <View style={styles.chipRow}>
          {Object.entries(filters).map(([k, v]) =>
            v ? (
              <View key={k} style={styles.chip}>
                <Text style={styles.chipText}>{`${k}: ${v}`}</Text>
              </View>
            ) : null
          )}
          <TouchableOpacity onPress={() => setFilters({})}>
            <Text style={styles.clearFilters}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        onEndReached={() => { if (hasMore && !loading) loadProfiles(); }}
        onEndReachedThreshold={0.4}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            onPress={() => navigation.navigate('ProfileDetails', { profileId: item.id })}
            onShortlist={() => toggleShortlist(item.id)}
            isShortlisted={shortlisted.has(item.id)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="people-outline"
              title="No profiles found"
              subtitle="Try adjusting your search filters"
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text, height: 42 },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FEF3ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    paddingHorizontal: 12,
    gap: 6,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chip: {
    backgroundColor: '#FEF3ED',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: { fontSize: 12, color: Colors.accent, fontWeight: '600' },
  clearFilters: { fontSize: 12, color: Colors.error, fontWeight: '600', paddingVertical: 4 },
  list: { padding: 14 },
});
