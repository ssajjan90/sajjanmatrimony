import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { createProfile, updateProfile, getMyProfile } from '../../api/profile.api';
import { useAuthStore } from '../../store/useAuthStore';
import { ProfileRequest } from '../../api/types';
import type { CreateProfileRouteProp } from '../../navigation/types';

const GENDERS = ['MALE', 'FEMALE'];
const MARITAL_STATUSES = ['NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'AWAITING_DIVORCE'];
const STEP_TITLES = ['Personal Details', 'Religion & Culture', 'Career & Education', 'Location & Bio'];

const Step = ({ current, total }: { current: number; total: number }) => (
  <View style={styles.stepBar}>
    {Array.from({ length: total }).map((_, i) => (
      <View key={i} style={[styles.stepDot, i <= current && styles.stepDotActive]}>
        {i < current && <Text style={styles.stepCheck}>✓</Text>}
        {i === current && <Text style={styles.stepNum}>{i + 1}</Text>}
        {i > current && <Text style={[styles.stepNum, { color: Colors.textLight }]}>{i + 1}</Text>}
      </View>
    ))}
  </View>
);

export default function CreateProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute<CreateProfileRouteProp>();
  const isEdit = route.params?.isEdit ?? false;
  const setHasProfile = useAuthStore((s) => s.setHasProfile);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(isEdit);

  // Step 0 — Personal
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('MALE');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [height, setHeight] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('NEVER_MARRIED');

  // Step 1 — Religion & Culture
  const [motherTongue, setMotherTongue] = useState('');
  const [caste, setCaste] = useState('');
  const [gotra, setGotra] = useState('');
  const [horoscope, setHoroscope] = useState('');
  const [diet, setDiet] = useState('');

  // Step 2 — Career & Education
  const [education, setEducation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');

  // Step 3 — Location & Bio
  const [city, setCity] = useState('');
  const [nativePlace, setNativePlace] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isEdit) return;
    getMyProfile()
      .then((res) => {
        const p = res.data.data!;
        setFullName(p.fullName);
        setGender(p.gender);
        setDateOfBirth(p.dateOfBirth ?? '');
        setHeight(p.height ?? '');
        setMaritalStatus(p.maritalStatus);
        setMotherTongue(p.motherTongue ?? '');
        setCaste(p.caste ?? '');
        const ad = p.additionalDetails ?? {};
        setGotra(String(ad.gotra ?? ''));
        setHoroscope(String(ad.horoscope ?? ''));
        setDiet(String(ad.diet ?? ''));
        setEducation(p.education);
        setOccupation(p.occupation);
        setAnnualIncome(p.annualIncome ?? '');
        setCity(p.city);
        setNativePlace(p.nativePlace ?? '');
        setAboutMe(p.aboutMe ?? '');
      })
      .catch(() => { /* ignore */ })
      .finally(() => setPrefilling(false));
  }, [isEdit]);

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!fullName.trim()) e.fullName = 'Required';
      if (!dateOfBirth.match(/^\d{4}-\d{2}-\d{2}$/)) e.dateOfBirth = 'Use format YYYY-MM-DD';
    }
    if (step === 2) {
      if (!education.trim()) e.education = 'Required';
      if (!occupation.trim()) e.occupation = 'Required';
    }
    if (step === 3) {
      if (!city.trim()) e.city = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEP_TITLES.length - 1) setStep((s) => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload: ProfileRequest = {
      fullName: fullName.trim(),
      gender,
      dateOfBirth,
      height: height.trim() || undefined,
      maritalStatus,
      motherTongue: motherTongue.trim() || undefined,
      caste: caste.trim() || undefined,
      education: education.trim(),
      occupation: occupation.trim(),
      annualIncome: annualIncome.trim() || undefined,
      city: city.trim(),
      nativePlace: nativePlace.trim() || undefined,
      aboutMe: aboutMe.trim() || undefined,
      additionalDetails: {
        ...(gotra && { gotra }),
        ...(horoscope && { horoscope }),
        ...(diet && { diet }),
      },
    };

    try {
      if (isEdit) await updateProfile(payload);
      else await createProfile(payload);
      setHasProfile(true);
      Alert.alert('Success', isEdit ? 'Profile updated!' : 'Profile created!', [
        { text: 'OK', onPress: () => navigation.navigate('MainTabs' as never) },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (prefilling) {
    return <LoadingOverlay visible message="Loading profile..." />;
  }

  const ChipRow = ({
    label,
    options,
    value,
    onChange,
  }: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, value === opt && styles.chipActive]}
            onPress={() => onChange(opt)}
          >
            <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>
              {opt.replace(/_/g, ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LoadingOverlay visible={loading} message="Saving profile..." />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{STEP_TITLES[step]}</Text>
        <Text style={styles.headerSub}>Step {step + 1} of {STEP_TITLES.length}</Text>
        <Step current={step} total={STEP_TITLES.length} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {step === 0 && (
          <View>
            <AppInput label="Full Name *" placeholder="Enter full name" value={fullName} onChangeText={setFullName} error={errors.fullName} />
            <ChipRow label="Gender" options={GENDERS} value={gender} onChange={setGender} />
            <AppInput label="Date of Birth * (YYYY-MM-DD)" placeholder="1995-06-15" value={dateOfBirth} onChangeText={setDateOfBirth} error={errors.dateOfBirth} keyboardType="numeric" />
            <AppInput label="Height" placeholder="5'10&quot;" value={height} onChangeText={setHeight} />
            <ChipRow label="Marital Status" options={MARITAL_STATUSES} value={maritalStatus} onChange={setMaritalStatus} />
          </View>
        )}

        {step === 1 && (
          <View>
            <AppInput label="Mother Tongue" placeholder="e.g. Kannada" value={motherTongue} onChangeText={setMotherTongue} />
            <AppInput label="Caste" placeholder="e.g. Brahmin" value={caste} onChangeText={setCaste} />
            <AppInput label="Gotra" placeholder="e.g. Bharadwaja" value={gotra} onChangeText={setGotra} />
            <AppInput label="Horoscope / Rashi" placeholder="e.g. Mesha" value={horoscope} onChangeText={setHoroscope} />
            <AppInput label="Diet" placeholder="e.g. Vegetarian" value={diet} onChangeText={setDiet} />
          </View>
        )}

        {step === 2 && (
          <View>
            <AppInput label="Education *" placeholder="e.g. B.Tech Computer Science" value={education} onChangeText={setEducation} error={errors.education} />
            <AppInput label="Occupation *" placeholder="e.g. Software Engineer" value={occupation} onChangeText={setOccupation} error={errors.occupation} />
            <AppInput label="Annual Income" placeholder="e.g. 12 LPA" value={annualIncome} onChangeText={setAnnualIncome} />
          </View>
        )}

        {step === 3 && (
          <View>
            <AppInput label="City *" placeholder="e.g. Bangalore" value={city} onChangeText={setCity} error={errors.city} />
            <AppInput label="Native Place" placeholder="e.g. Mysore" value={nativePlace} onChangeText={setNativePlace} />
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>About Me</Text>
              <View style={styles.textAreaWrap}>
                <AppInput
                  placeholder="Write a few lines about yourself, your values and what you're looking for..."
                  value={aboutMe}
                  onChangeText={setAboutMe}
                  multiline
                  numberOfLines={5}
                  style={{ height: 110, textAlignVertical: 'top' }}
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <AppButton title="Back" onPress={() => setStep((s) => s - 1)} variant="outline" style={styles.backBtn} fullWidth={false} />
        )}
        <AppButton
          title={step === STEP_TITLES.length - 1 ? (isEdit ? 'Update Profile' : 'Create Profile') : 'Next →'}
          onPress={handleNext}
          loading={loading}
          style={styles.nextBtn}
          fullWidth={false}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { padding: 20, paddingBottom: 20 },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2, marginBottom: 14 },
  stepBar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: Colors.white },
  stepNum: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  stepCheck: { fontSize: 13, color: Colors.primary, fontWeight: '800' },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: Colors.white },
  textAreaWrap: {},
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn: { flex: 1, paddingVertical: 12 },
  nextBtn: { flex: 2, paddingVertical: 12 },
});
