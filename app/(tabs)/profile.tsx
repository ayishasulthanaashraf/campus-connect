import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/services/auth';
import { T } from '../../src/theme';

type InfoRowProps = { label: string; value: string; emoji: string };

function InfoRow({ label, value, emoji }: InfoRowProps) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoEmoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { student, logout } = useAuth();

  function handleLogout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={s.content} contentContainerStyle={s.scroll}>

        {/* ── Avatar + name ── */}
        <View style={s.hero}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{student.name[0]}</Text>
          </View>
          <Text style={s.name}>{student.name}</Text>
          <Text style={s.regNo}>{student.regNo}</Text>
          <View style={s.semBadge}>
            <Text style={s.semBadgeText}>{student.semester} · {student.batch}</Text>
          </View>
        </View>

        {/* ── Academic info ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Academic Details</Text>
          <View style={s.card}>
            <InfoRow label="Department"      value={student.department}  emoji="🏫" />
            <View style={s.divider} />
            <InfoRow label="Batch"           value={student.batch}       emoji="🎓" />
            <View style={s.divider} />
            <InfoRow label="College"         value={student.college}     emoji="📍" />
          </View>
        </View>

        {/* ── Contact info ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Contact</Text>
          <View style={s.card}>
            <InfoRow label="Email" value={student.email} emoji="📧" />
          </View>
        </View>

        {/* ── Quick links ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Quick Links</Text>
          <View style={s.card}>
            {[
              { label: 'View Marks', emoji: '📊', onPress: () => router.push('/marks' as any) },
              { label: 'Notifications', emoji: '🔔', onPress: () => {} },
              { label: 'Help & Support', emoji: '❓', onPress: () => {} },
              { label: 'About App', emoji: 'ℹ️', onPress: () => {} },
            ].map((item, i, arr) => (
              <View key={item.label}>
                <TouchableOpacity style={s.settingRow} onPress={item.onPress}>
                  <Text style={s.infoEmoji}>{item.emoji}</Text>
                  <Text style={s.settingLabel}>{item.label}</Text>
                  <Text style={s.chevron}>›</Text>
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={s.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={s.logoutText}>🚪  Logout</Text>
        </TouchableOpacity>

        <Text style={s.version}>Campus Connect v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: T.bg },
  headerTitle: { fontSize: T.font.heading, fontWeight: '800', color: T.light },
  content: {
    flex: 1, backgroundColor: T.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  scroll: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 40 },

  // Hero
  hero: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: T.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: T.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  avatarText: { color: T.light, fontSize: 36, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700', color: T.black, textAlign: 'center' },
  regNo: { fontSize: 14, color: T.muted, marginTop: 4 },
  semBadge: {
    backgroundColor: T.accent + '22', borderRadius: T.radiusPill, paddingHorizontal: 14,
    paddingVertical: 5, marginTop: 10, borderWidth: 1, borderColor: T.accent,
  },
  semBadgeText: { fontSize: 13, color: T.accent, fontWeight: '600' },

  // Sections
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 14, fontWeight: '700', color: T.muted, marginBottom: 10,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },

  card: {
    backgroundColor: T.light, borderRadius: T.radius, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  infoEmoji: { fontSize: 20, marginRight: 14 },
  infoLabel: { fontSize: 11, color: T.muted, fontWeight: '500', marginBottom: 2 },
  infoValue: { fontSize: 14, color: T.black, fontWeight: '600' },
  divider: { height: 1, backgroundColor: T.muted + '25', marginLeft: 52 },

  // Settings rows
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  settingLabel: { flex: 1, fontSize: 15, color: T.black, fontWeight: '500' },
  chevron: { fontSize: 22, color: T.muted },

  // Logout
  logoutBtn: {
    backgroundColor: T.danger + '18', borderRadius: T.radiusPill, paddingVertical: 15,
    alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: T.danger + '40',
  },
  logoutText: { color: T.danger, fontSize: 16, fontWeight: '700' },
  version: { textAlign: 'center', fontSize: 12, color: T.muted },
});
