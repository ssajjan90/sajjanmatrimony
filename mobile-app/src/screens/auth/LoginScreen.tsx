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
import { login } from '../../api/auth.api';
import { getMyProfile } from '../../api/profile.api';
import { useAuthStore } from '../../store/useAuthStore';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'> };

export default function LoginScreen({ navigation }: Props) {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const setHasProfile = useAuthStore((s) => s.setHasProfile);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!emailOrMobile.trim()) e.emailOrMobile = 'Email or mobile is required';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await login({ emailOrMobile: emailOrMobile.trim(), password });
      const { accessToken, refreshToken, user } = res.data.data!;
      setAuth(accessToken, refreshToken, user);

      try {
        await getMyProfile();
        setHasProfile(true);
      } catch {
        setHasProfile(false);
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
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
            <Text style={styles.heroSub}>Your journey to a perfect match begins here</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Login to your Account</Text>
          </View>

          <View style={styles.form}>
            <AppInput
              label="Email or Mobile Number"
              placeholder="Enter email or 10-digit mobile"
              value={emailOrMobile}
              onChangeText={setEmailOrMobile}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.emailOrMobile}
            />
            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={errors.password}
            />

            <AppButton title="Login" onPress={handleLogin} loading={loading} style={styles.loginBtn} />

            <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>
                Don't have an account?{' '}
                <Text style={styles.linkAccent}>Sign Up here</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 0.42 },
  heroContent: { alignItems: 'center', paddingTop: 32, paddingBottom: 20 },
  heroEmoji: { fontSize: 52, marginBottom: 8 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: Colors.white, letterSpacing: 0.3 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.82)', marginTop: 6, textAlign: 'center' },
  sheet: {
    flex: 0.58,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  sheetHeader: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: Colors.white, textAlign: 'center' },
  form: { padding: 24 },
  loginBtn: { marginTop: 8, backgroundColor: Colors.secondary },
  linkRow: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 14, color: Colors.textSecondary },
  linkAccent: { color: Colors.primary, fontWeight: '700' },
});
