import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import AppButton from '../../components/common/AppButton';
import { getProfileById } from '../../api/profile.api';
import { expressInterest } from '../../api/interest.api';
import { addToShortlist, removeFromShortlist } from '../../api/shortlist.api';
import { ProfileResponse } from '../../api/types';
import { API_BASE_URL } from '../../api/client';
import type { ProfileDetailsRouteProp } from '../../navigation/types';

interface InfoRowProps { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value?: string | number | null; }
const InfoRow = ({ icon, label, value }: InfoRowProps) =>
  value ? (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color={Colors.primary} style={styles.infoIcon} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{String(value)}</Text>
    </View>
  ) : null;

export default function ProfileDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<ProfileDetailsRouteProp>();
  const { profileId } = route.params;

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getProfileById(profileId)
      .then((res) => setProfile(res.data.data ?? null))
      .catch((err) => Alert.alert('Error', err.message))
      .finally(() => setLoading(false));
  }, [profileId]);

  const sendInterest = async () => {
    setActionLoading(true);
    try {
      await expressInterest(profileId);
      setInterestSent(true);
      Alert.alert('Success', 'Interest sent successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleShortlist = async () => {
    setActionLoading(true);
    try {
      if (shortlisted) {
        await removeFromShortlist(profileId);
        setShortlisted(false);
      } else {
        await addToShortlist(profileId);
        setShortlisted(true);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!profile) return null;

  const photoUri = profile.photoUrls?.[0]
    ? `${API_BASE_URL.replace('/api/v1', '')}/api/v1/uploads/${profile.photoUrls[0]}`
    : null;

  const additional = profile.additionalDetails ?? {};

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Photo header */}
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photo} />
      ) : (
        <LinearGradient colors={Colors.gradientCard} style={styles.photo}>
          <Ionicons name="person" size={72} color="rgba(255,255,255,0.6)" />
        </LinearGradient>
      )}

      {/* Name banner */}
      <View style={styles.nameBanner}>
        <View style={styles.nameRow}>
          <View>
            <Text style={styles.name}>{profile.fullName}, {profile.age}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.location}>{profile.city}</Text>
            </View>
          </View>
          {profile.approved && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.body}>
        {/* About */}
        {profile.aboutMe && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{profile.aboutMe}</Text>
          </View>
        )}

        {/* Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <InfoRow icon="person-outline" label="Gender" value={profile.gender} />
          <InfoRow icon="calendar-outline" label="Date of Birth" value={profile.dateOfBirth} />
          <InfoRow icon="resize-outline" label="Height" value={profile.height} />
          <InfoRow icon="heart-outline" label="Marital Status" value={profile.maritalStatus?.replace('_', ' ')} />
          <InfoRow icon="language-outline" label="Mother Tongue" value={profile.motherTongue} />
          <InfoRow icon="people-outline" label="Caste" value={profile.caste} />
          {additional.gotra && <InfoRow icon="leaf-outline" label="Gotra" value={String(additional.gotra)} />}
          {additional.horoscope && <InfoRow icon="star-outline" label="Horoscope" value={String(additional.horoscope)} />}
        </View>

        {/* Education & Career */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education & Career</Text>
          <InfoRow icon="school-outline" label="Education" value={profile.education} />
          <InfoRow icon="briefcase-outline" label="Occupation" value={profile.occupation} />
          <InfoRow icon="cash-outline" label="Annual Income" value={profile.annualIncome} />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <InfoRow icon="location-outline" label="City" value={profile.city} />
          <InfoRow icon="home-outline" label="Native Place" value={profile.nativePlace} />
        </View>

        {/* Additional */}
        {(additional.diet || additional.familyType || additional.hobbies) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lifestyle</Text>
            {additional.diet && <InfoRow icon="restaurant-outline" label="Diet" value={String(additional.diet)} />}
            {additional.familyType && <InfoRow icon="home-outline" label="Family Type" value={String(additional.familyType)} />}
            {Array.isArray(additional.hobbies) && (
              <View style={styles.infoRow}>
                <Ionicons name="color-palette-outline" size={16} color={Colors.primary} style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Hobbies</Text>
                <Text style={styles.infoValue}>{(additional.hobbies as string[]).join(', ')}</Text>
              </View>
            )}
          </View>
        )}

        {/* Partner Preferences */}
        {profile.partnerPreferences && Object.keys(profile.partnerPreferences).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Partner Preferences</Text>
            {Object.entries(profile.partnerPreferences).map(([k, v]) => (
              <InfoRow key={k} icon="heart-circle-outline" label={k} value={Array.isArray(v) ? v.join(', ') : String(v)} />
            ))}
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          <AppButton
            title={shortlisted ? 'Shortlisted ★' : 'Shortlist'}
            onPress={toggleShortlist}
            variant="outline"
            loading={actionLoading}
            style={styles.actionBtn}
            fullWidth={false}
          />
          <AppButton
            title={interestSent ? 'Interest Sent ✓' : 'Express Interest'}
            onPress={sendInterest}
            loading={actionLoading}
            disabled={interestSent}
            style={styles.actionBtn}
            fullWidth={false}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photo: {
    height: 320,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
  nameBanner: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: 22, fontWeight: '800', color: Colors.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  location: { fontSize: 14, color: Colors.textSecondary },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E8F5E9', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  verifiedText: { fontSize: 12, color: Colors.success, fontWeight: '700' },
  body: { padding: 0 },
  section: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: Colors.primary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  aboutText: { fontSize: 15, color: Colors.text, lineHeight: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  infoIcon: { marginRight: 10, marginTop: 1 },
  infoLabel: { fontSize: 13, color: Colors.textSecondary, width: 110, fontWeight: '600' },
  infoValue: { flex: 1, fontSize: 14, color: Colors.text, fontWeight: '500' },
  actions: { flexDirection: 'row', padding: 20, gap: 12 },
  actionBtn: { flex: 1, paddingVertical: 12 },
});
