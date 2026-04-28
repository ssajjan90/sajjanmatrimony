import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { register, login } from '../../api/auth.api';
import { useAuthStore } from '../../store/useAuthStore';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'> };

const GENDERS = ['MALE', 'FEMALE'];
const PROFILE_FOR = ['Myself', 'My Son', 'My Daughter', 'My Brother', 'My Sister'];

export default function RegisterScreen({ navigation }: Props) {
  const [profileFor, setProfileFor] = useState('Myself');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('MALE');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showProfileFor, setShowProfileFor] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const setHasProfile = useAuthStore((s) => s.setHasProfile);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email is required';
    if (!mobile.trim() || !/^[6-9]\d{9}$/.test(mobile)) e.mobile = 'Valid 10-digit mobile required';
    if (!password || password.length < 8) e.password = 'Password must be at least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ fullName: fullName.trim(), email: email.trim().toLowerCase(), mobile: mobile.trim(), password, gender });
      const loginRes = await login({ emailOrMobile: email.trim().toLowerCase(), password });
      const { accessToken, refreshToken, user } = loginRes.data.data!;
      setAuth(accessToken, refreshToken, user);
      setHasProfile(false);
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#4A0000', '#8B1A1A', '#C0392B', '#E8853D']} style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>💍</Text>
            <Text style={styles.heroTitle}>Sajjan Matrimony</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Register for Free</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            {/* Profile For Picker */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Select a profile for</Text>
              <TouchableOpacity style={styles.picker} onPress={() => setShowProfileFor(!showProfileFor)}>
                <Text style={styles.pickerValue}>{profileFor}</Text>
                <Text style={styles.pickerChevron}>▾</Text>
              </TouchableOpacity>
              {showProfileFor && (
                <View style={styles.dropdown}>
                  {PROFILE_FOR.map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={styles.dropdownItem}
                      onPress={() => { setProfileFor(p); setShowProfileFor(false); }}
                    >
                      <Text style={[styles.dropdownText, profileFor === p && styles.dropdownSelected]}>
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Gender */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {GENDERS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                      {g === 'MALE' ? '👨 Male' : '👩 Female'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <AppInput label="Full Name" placeholder="Enter full name" value={fullName} onChangeText={setFullName} error={errors.fullName} />
            <AppInput label="Email Address" placeholder="Enter email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
            <AppInput label="Mobile Number" placeholder="Enter 10-digit mobile number" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" maxLength={10} error={errors.mobile} />
            <AppInput label="Create Password" placeholder="Minimum 8 characters" value={password} onChangeText={setPassword} isPassword error={errors.password} />

            <AppButton title="Register Now" onPress={handleRegister} loading={loading} style={styles.registerBtn} />

            <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>
                Already a member? <Text style={styles.linkAccent}>Login here</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 0.28 },
  heroContent: { alignItems: 'center', paddingTop: 28, paddingBottom: 16 },
  heroEmoji: { fontSize: 40, marginBottom: 6 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: Colors.white },
  sheet: {
    flex: 0.72,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    elevation: 10,
  },
  sheetHeader: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: Colors.white, textAlign: 'center' },
  form: { padding: 20, paddingBottom: 40 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 48,
  },
  pickerValue: { fontSize: 15, color: Colors.text },
  pickerChevron: { fontSize: 14, color: Colors.textSecondary },
  dropdown: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    elevation: 4,
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12 },
  dropdownText: { fontSize: 15, color: Colors.text },
  dropdownSelected: { color: Colors.primary, fontWeight: '700' },
  genderRow: { flexDirection: 'row', gap: 12 },
  genderBtn: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingVertical: 10,
    alignItems: 'center',
  },
  genderBtnActive: { borderColor: Colors.primary, backgroundColor: '#FEF3ED' },
  genderText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  genderTextActive: { color: Colors.primary },
  registerBtn: { marginTop: 8, backgroundColor: Colors.secondary },
  linkRow: { marginTop: 18, alignItems: 'center' },
  linkText: { fontSize: 14, color: Colors.textSecondary },
  linkAccent: { color: Colors.primary, fontWeight: '700' },
});
