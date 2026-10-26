import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/services/auth';
import { SUBJECTS, ATTENDANCE, TIMETABLE, CALENDAR_EVENTS } from '../../src/data';
import { T } from '../../src/theme';

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HomeScreen() {
  const router = useRouter();
  const { student } = useAuth();
  const firstName = student.name.split(' ')[0];

  // Overall attendance
  const totalAttended = ATTENDANCE.reduce((s, a) => s + a.attended, 0);
  const totalClasses = ATTENDANCE.reduce((s, a) => s + a.total, 0);
  const overallPct = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  // Today's schedule
  const dayKey = DAYS_SHORT[new Date().getDay()];
  const todaySchedule = TIMETABLE[dayKey] ?? [];
  const todayClasses = todaySchedule.filter(p => p.type !== 'free');

  // Upcoming events
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = CALENDAR_EVENTS.filter(e => e.date >= today).slice(0, 3);

  return (
    <SafeAreaView style={s.safe}>
      {/* Dark header */}
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.greeting}>Hi, {firstName}!</Text>
          <Text style={s.subInfo}>{student.regNo} · {student.department}</Text>
        </View>
        <TouchableOpacity style={s.avatar} onPress={() => router.push('/(tabs)/profile')}>
          <Text style={s.avatarText}>{firstName[0]}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={s.content} contentContainerStyle={s.scroll}>

        {/* ── Quick stats ── */}
        <View style={s.statsRow}>
          <View style={[s.statCard, { borderLeftColor: T.accent }]}>
            <Text style={s.statValue}>{overallPct}%</Text>
            <Text style={s.statLabel}>Attendance</Text>
          </View>
          <View style={[s.statCard, { borderLeftColor: T.success }]}>
            <Text style={s.statValue}>{todayClasses.length}</Text>
            <Text style={s.statLabel}>Classes today</Text>
          </View>
          <View style={[s.statCard, { borderLeftColor: T.muted }]}>
            <Text style={s.statValue}>{student.semester}</Text>
            <Text style={s.statLabel}>Semester</Text>
          </View>
        </View>

        {/* ── Today's timetable ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Today's Classes</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/timetable')}>
              <Text style={s.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>

          {todayClasses.length === 0 ? (
            <View style={s.emptyCard}>
              <Text style={{ fontSize: 16, color: T.muted }}>🎉 No classes today!</Text>
            </View>
          ) : (
            todayClasses.slice(0, 4).map((cls, i) => {
              const subj = SUBJECTS.find(s => s.code === cls.subjectCode);
              return (
                <View key={i} style={s.classCard}>
                  <View style={s.classTime}>
                    <Text style={s.classTimeText}>{cls.startTime}</Text>
                  </View>
                  <View style={s.classInfo}>
                    <Text style={s.classSubject}>{subj?.name ?? cls.subjectCode}</Text>
                    <Text style={s.classMeta}>📍 {cls.room} · {subj?.faculty ?? ''}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* ── Upcoming events ── */}
        {upcoming.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Upcoming</Text>
            {upcoming.map((ev, i) => (
              <View key={i} style={s.eventCard}>
                <View style={s.eventDot(ev.type)} />
                <View style={{ flex: 1 }}>
                  <Text style={s.eventTitle}>{ev.title}</Text>
                  <Text style={s.eventDate}>{ev.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── Quick actions ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
          <View style={s.actionsRow}>
            {[
              { label: 'Attendance', emoji: '📋', route: '/(tabs)/attendance' },
              { label: 'Timetable', emoji: '🗓️', route: '/(tabs)/timetable' },
              { label: 'Marks', emoji: '📊', route: '/marks' },
              { label: 'Profile', emoji: '👤', route: '/(tabs)/profile' },
            ].map(a => (
              <TouchableOpacity key={a.label} style={s.actionBtn} onPress={() => router.push(a.route as any)}>
                <Text style={s.actionEmoji}>{a.emoji}</Text>
                <Text style={s.actionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const EVENT_COLORS: Record<string, string> = {
  exam: T.danger,
  holiday: T.success,
  event: T.accent,
  deadline: '#E6A817',
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: T.bg,
  },
  greeting: { fontSize: 26, fontWeight: '800', color: T.light, marginBottom: 4 },
  subInfo: { fontSize: 12, color: T.muted },
  avatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: T.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: T.light, fontSize: 20, fontWeight: '700' },

  // Content panel
  content: {
    flex: 1, backgroundColor: T.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: T.light, borderRadius: 16, padding: 14,
    borderLeftWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: '700', color: T.black },
  statLabel: { fontSize: 11, color: T.muted, marginTop: 4 },

  // Section
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: T.black },
  seeAll: { fontSize: 13, color: T.accent, fontWeight: '600' },

  // Class cards
  classCard: {
    flexDirection: 'row', backgroundColor: T.light, borderRadius: 16, padding: 14,
    marginBottom: 10, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  classTime: { backgroundColor: T.accent + '15', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginRight: 14 },
  classTimeText: { fontSize: 12, fontWeight: '700', color: T.accent, textAlign: 'center' },
  classInfo: { flex: 1 },
  classSubject: { fontSize: 15, fontWeight: '600', color: T.black },
  classMeta: { fontSize: 12, color: T.muted, marginTop: 3 },

  emptyCard: {
    backgroundColor: T.light, borderRadius: 16, padding: 24, alignItems: 'center',
  },

  // Event cards
  eventCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: T.light, borderRadius: 14, padding: 14,
    marginBottom: 8,
  },
  eventDot: ((type: string) => ({
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: EVENT_COLORS[type] ?? T.muted, marginRight: 14,
  })) as any,
  eventTitle: { fontSize: 14, fontWeight: '600', color: T.black },
  eventDate: { fontSize: 12, color: T.muted, marginTop: 2 },

  // Quick actions
  actionsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  actionBtn: {
    width: '47%' as any, backgroundColor: T.light, borderRadius: 16, padding: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    marginBottom: 10,
  },
  actionEmoji: { fontSize: 28, marginBottom: 8 },
  actionLabel: { fontSize: 12, color: T.muted, fontWeight: '600' },
});
