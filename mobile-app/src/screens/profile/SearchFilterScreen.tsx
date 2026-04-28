import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import type { SearchFilterRouteProp } from '../../navigation/types';
import { SearchFilters } from '../../api/types';

const GENDERS = ['MALE', 'FEMALE'];
const MARITAL_STATUSES = ['NEVER_MARRIED', 'DIVORCED', 'WIDOWED'];
const AGE_OPTIONS = [18, 20, 22, 24, 26, 28, 30, 32, 35, 40, 45, 50];

export default function SearchFilterScreen() {
  const navigation = useNavigation();
  const route = useRoute<SearchFilterRouteProp>();
  const { currentFilters, onApply } = route.params;

  const [gender, setGender] = useState(currentFilters.gender ?? '');
  const [minAge, setMinAge] = useState(currentFilters.minAge?.toString() ?? '');
  const [maxAge, setMaxAge] = useState(currentFilters.maxAge?.toString() ?? '');
  const [city, setCity] = useState(currentFilters.city ?? '');
  const [education, setEducation] = useState(currentFilters.education ?? '');
  const [occupation, setOccupation] = useState(currentFilters.occupation ?? '');
  const [maritalStatus, setMaritalStatus] = useState(currentFilters.maritalStatus ?? '');
  const [caste, setCaste] = useState(currentFilters.caste ?? '');

  const handleApply = () => {
    const filters: SearchFilters = {};
    if (gender) filters.gender = gender;
    if (minAge) filters.minAge = parseInt(minAge);
    if (maxAge) filters.maxAge = parseInt(maxAge);
    if (city.trim()) filters.city = city.trim();
    if (education.trim()) filters.education = education.trim();
    if (occupation.trim()) filters.occupation = occupation.trim();
    if (maritalStatus) filters.maritalStatus = maritalStatus;
    if (caste.trim()) filters.caste = caste.trim();
    onApply(filters);
    navigation.goBack();
  };

  const handleReset = () => {
    setGender(''); setMinAge(''); setMaxAge(''); setCity('');
    setEducation(''); setOccupation(''); setMaritalStatus(''); setCaste('');
    onApply({});
    navigation.goBack();
  };

  const Chip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
      {active && <Ionicons name="checkmark" size={12} color={Colors.white} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.chipRow}>
          <Chip label="All" active={!gender} onPress={() => setGender('')} />
          {GENDERS.map((g) => (
            <Chip key={g} label={g === 'MALE' ? '👨 Male' : '👩 Female'} active={gender === g} onPress={() => setGender(g)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Age Range</Text>
        <View style={styles.ageRow}>
          <View style={{ flex: 1 }}>
            <AppInput
              label="Min Age"
              placeholder="22"
              value={minAge}
              onChangeText={setMinAge}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          <Text style={styles.ageSeparator}>to</Text>
          <View style={{ flex: 1 }}>
            <AppInput
              label="Max Age"
              placeholder="35"
              value={maxAge}
              onChangeText={setMaxAge}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Marital Status</Text>
        <View style={styles.chipRow}>
          <Chip label="Any" active={!maritalStatus} onPress={() => setMaritalStatus('')} />
          {MARITAL_STATUSES.map((s) => (
            <Chip key={s} label={s.replace('_', ' ')} active={maritalStatus === s} onPress={() => setMaritalStatus(s)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppInput label="City" placeholder="e.g. Bangalore" value={city} onChangeText={setCity} />
        <AppInput label="Education" placeholder="e.g. B.Tech" value={education} onChangeText={setEducation} />
        <AppInput label="Occupation" placeholder="e.g. Software Engineer" value={occupation} onChangeText={setOccupation} />
        <AppInput label="Caste" placeholder="e.g. Brahmin" value={caste} onChangeText={setCaste} />
      </View>

      <View style={styles.actions}>
        <AppButton title="Reset" onPress={handleReset} variant="outline" style={styles.resetBtn} fullWidth={false} />
        <AppButton title="Apply Filters" onPress={handleApply} style={styles.applyBtn} fullWidth={false} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  ageRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ageSeparator: { fontSize: 14, color: Colors.textSecondary, marginTop: -8 },
  actions: { flexDirection: 'row', padding: 16, gap: 12, justifyContent: 'center' },
  resetBtn: { flex: 1, paddingVertical: 12 },
  applyBtn: { flex: 2, paddingVertical: 12 },
});
