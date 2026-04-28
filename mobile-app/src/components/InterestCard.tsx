import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Interest } from '../api/types';

interface Props {
  interest: Interest;
  type: 'sent' | 'received';
  onAccept?: () => void;
  onReject?: () => void;
  onViewProfile?: () => void;
}

const statusColor: Record<string, string> = {
  PENDING: Colors.warning,
  ACCEPTED: Colors.success,
  REJECTED: Colors.error,
};

const statusIcon: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  PENDING: 'time-outline',
  ACCEPTED: 'checkmark-circle-outline',
  REJECTED: 'close-circle-outline',
};

export default function InterestCard({ interest, type, onAccept, onReject, onViewProfile }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={28} color={Colors.white} />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>
          {type === 'sent' ? `To: ${interest.toProfileId}` : `From: ${interest.fromProfileId}`}
        </Text>
        {interest.message && (
          <Text style={styles.message} numberOfLines={2}>
            "{interest.message}"
          </Text>
        )}
        <View style={styles.statusRow}>
          <Ionicons name={statusIcon[interest.status]} size={14} color={statusColor[interest.status]} />
          <Text style={[styles.status, { color: statusColor[interest.status] }]}>
            {interest.status}
          </Text>
        </View>

        {type === 'received' && interest.status === 'PENDING' && (
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]} onPress={onAccept}>
              <Ionicons name="checkmark" size={14} color={Colors.white} />
              <Text style={styles.actionText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={onReject}>
              <Ionicons name="close" size={14} color={Colors.white} />
              <Text style={styles.actionText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}

        {onViewProfile && (
          <TouchableOpacity onPress={onViewProfile} style={styles.viewLink}>
            <Text style={styles.viewLinkText}>View Profile →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  message: { fontSize: 13, color: Colors.textSecondary, fontStyle: 'italic', marginBottom: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  status: { fontSize: 12, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  acceptBtn: { backgroundColor: Colors.secondary },
  rejectBtn: { backgroundColor: Colors.error },
  actionText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  viewLink: { marginTop: 4 },
  viewLinkText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
});
