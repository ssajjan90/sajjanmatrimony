import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/colors';
import AppButton from '../../components/common/AppButton';
import { getMyProfile } from '../../api/profile.api';
import { useAuthStore } from '../../store/useAuthStore';
import { ProfileResponse } from '../../api/types';
import { API_BASE_URL } from '../../api/client';
import apiClient from '../../api/client';
import type { MainNavProp } from '../../navigation/types';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Row = ({ label, value }: { label: string; value?: string | null }) =>
  value ? (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  ) : null;

export default function MyProfileScreen() {
  const navigation = useNavigation<MainNavProp>();
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfile(res.data.data ?? null);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { loadProfile(); }, []));

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const uploadPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo library access to upload photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (result.canceled) return;

    setUploading(true);
    try {
      const formData = new FormData();
      const asset = result.assets[0];
      const filename = asset.uri.split('/').pop() ?? 'photo.jpg';
      formData.append('file', { uri: asset.uri, name: filename, type: 'image/jpeg' } as any);
      await apiClient.post('/files/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Success', 'Photo uploaded!');
      loadProfile();
    } catch (err: any) {
      Alert.alert('Upload failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const photoUri = profile?.photoUrls?.[0]
    ? `${API_BASE_URL.replace('/api/v1', '')}/api/v1/uploads/${profile.photoUrls[0]}`
    : null;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadProfile(); }} colors={[Colors.primary]} />}
    >
      {/* Header */}
      <LinearGradient colors={['#4A0000', '#C0392B', '#E8853D']} style={styles.header}>
        <TouchableOpacity style={styles.photoContainer} onPress={uploadPhoto} disabled={uploading}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={44} color="rgba(255,255,255,0.7)" />
            </View>
          )}
          <View style={styles.cameraBtn}>
            {uploading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Ionicons name="camera" size={14} color={Colors.white} />
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.fullName ?? profile?.fullName ?? 'My Profile'}</Text>
        <Text style={styles.userMeta}>{user?.email}</Text>
        {profile?.approved && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
            <Text style={styles.verifiedText}>Verified Profile</Text>
          </View>
        )}
      </LinearGradient>

      {profile ? (
        <>
          <View style={styles.editRow}>
            <AppButton
              title="Edit Profile"
              onPress={() => navigation.navigate('CreateProfile', { isEdit: true })}
              variant="outline"
              fullWidth={false}
              style={styles.editBtn}
            />
          </View>

          <Section title="Personal">
            <Row label="Age" value={profile.age ? `${profile.age} years` : null} />
            <Row label="Height" value={profile.height} />
            <Row label="Gender" value={profile.gender} />
            <Row label="Marital Status" value={profile.maritalStatus?.replace('_', ' ')} />
            <Row label="Mother Tongue" value={profile.motherTongue} />
            <Row label="Caste" value={profile.caste} />
          </Section>

          <Section title="Career & Education">
            <Row label="Education" value={profile.education} />
            <Row label="Occupation" value={profile.occupation} />
            <Row label="Annual Income" value={profile.annualIncome} />
          </Section>

          <Section title="Location">
            <Row label="City" value={profile.city} />
            <Row label="Native Place" value={profile.nativePlace} />
          </Section>

          {profile.aboutMe && (
            <Section title="About Me">
              <Text style={styles.aboutText}>{profile.aboutMe}</Text>
            </Section>
          )}
        </>
      ) : (
        <View style={styles.noProfile}>
          <Ionicons name="person-add-outline" size={48} color={Colors.textLight} />
          <Text style={styles.noProfileText}>You haven't created your profile yet</Text>
          <AppButton
            title="Create Profile"
            onPress={() => navigation.navigate('CreateProfile')}
            style={{ marginTop: 16, paddingHorizontal: 32 }}
            fullWidth={false}
          />
        </View>
      )}

      <View style={styles.logoutRow}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', paddingTop: 32, paddingBottom: 28 },
  photoContainer: { marginBottom: 12 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: Colors.white },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userName: { fontSize: 20, fontWeight: '800', color: Colors.white },
  userMeta: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  verifiedText: { fontSize: 12, color: '#A5D6A7', fontWeight: '700' },
  editRow: { padding: 16, alignItems: 'flex-end', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  editBtn: { paddingHorizontal: 20, paddingVertical: 8 },
  section: { backgroundColor: Colors.white, marginTop: 8, paddingHorizontal: 20, paddingVertical: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: Colors.primary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  rowLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  rowValue: { fontSize: 14, color: Colors.text, fontWeight: '600', maxWidth: '55%', textAlign: 'right' },
  aboutText: { fontSize: 14, color: Colors.text, lineHeight: 22 },
  noProfile: { alignItems: 'center', padding: 48 },
  noProfileText: { fontSize: 15, color: Colors.textSecondary, marginTop: 12, textAlign: 'center' },
  logoutRow: { padding: 20, alignItems: 'center' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  logoutText: { fontSize: 15, color: Colors.error, fontWeight: '700' },
});
