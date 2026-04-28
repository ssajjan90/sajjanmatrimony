import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { Colors } from '../constants/colors';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Splash'>;
};

export default function SplashScreen({ navigation }: Props) {
  const logoScale = new Animated.Value(0.4);
  const logoOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Onboarding'), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#4A0000', '#8B1A1A', '#C0392B', '#E8853D']} style={styles.container}>
      <View style={styles.overlay} />
      <Animated.View style={[styles.logoWrap, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>💍</Text>
        </View>
        <Text style={styles.brand}>Sajjan Matrimony</Text>
        <Text style={styles.tagline}>Find Your Perfect Match</Text>
      </Animated.View>
      <Text style={styles.footer}>Trusted by thousands of families</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  logoWrap: { alignItems: 'center' },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoEmoji: { fontSize: 48 },
  brand: { fontSize: 30, fontWeight: '800', color: Colors.white, letterSpacing: 0.5, textAlign: 'center' },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6, letterSpacing: 1 },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
});
