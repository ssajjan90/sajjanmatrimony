import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { ProfileSummaryDto } from '../api/types';
import { API_BASE_URL } from '../api/client';

interface Props {
  profile: ProfileSummaryDto;
  onPress: () => void;
  onShortlist?: () => void;
  isShortlisted?: boolean;
}

export default function ProfileCard({ profile, onPress, onShortlist, isShortlisted }: Props) {
  const photoUri = profile.profilePhoto
    ? `${API_BASE_URL.replace('/api/v1', '')}/api/v1/uploads/${profile.profilePhoto}`
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photo} />
      ) : (
        <LinearGradient colors={Colors.gradientCard} style={styles.photo}>
          <Ionicons name="person" size={48} color="rgba(255,255,255,0.7)" />
        </LinearGradient>
      )}

      {onShortlist && (
        <TouchableOpacity style={styles.starBtn} onPress={onShortlist}>
          <Ionicons
            name={isShortlisted ? 'star' : 'star-outline'}
            size={20}
            color={isShortlisted ? Colors.warning : Colors.white}
          />
        </TouchableOpacity>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {profile.fullName}, {profile.age}
        </Text>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.meta}>{profile.city}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="school-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.meta} numberOfLines={1}>
            {profile.education}
          </Text>
        </View>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{profile.maritalStatus?.replace('_', ' ')}</Text>
          </View>
          {profile.caste && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{profile.caste}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  photo: {
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
  starBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    padding: 6,
  },
  info: { padding: 14 },
  name: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 3, gap: 4 },
  meta: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  badge: {
    backgroundColor: '#FEF3ED',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11, color: Colors.accent, fontWeight: '600' },
});
