import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { SUBJECTS, ATTENDANCE } from '../../src/data';
import { T, ATTENDANCE_THRESHOLD } from '../../src/theme';

function getColor(pct: number) {
  if (pct >= 75) return T.success;
  if (pct >= 65) return T.accent;
  return T.danger;
}

function AttendanceBar({ subjectCode, attended, total }: { subjectCode: string; attended: number; total: number }) {
  const subject = SUBJECTS.find(s => s.code === subjectCode);
  const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
  const color = getColor(pct);

  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={s.subjectName}>{subject?.name ?? subjectCode}</Text>
          <Text style={s.facultyName}>{subject?.faculty ?? ''}</Text>
        </View>
        <View style={[s.badge, { backgroundColor: color + '22', borderColor: color }]}>
          <Text style={[s.badgeText, { color }]}>{pct}%</Text>
        </View>
      </View>

      <View style={s.barBg}>
        <View style={[s.barFill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>

      <View style={s.cardBottom}>
        <Text style={s.countText}>{attended} / {total} classes</Text>
        {pct < 75 && (
          <Text style={[s.warningText, { color }]}>
            {pct < 65
              ? `⚠️ Short by ${Math.ceil(total * ATTENDANCE_THRESHOLD - attended)}`
              : `⚡ Need ${Math.ceil(total * ATTENDANCE_THRESHOLD - attended)} more`}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function AttendanceScreen() {
  const [filter, setFilter] = useState<'all' | 'low'>('all');

  const totalAttended = ATTENDANCE.reduce((s, a) => s + a.attended, 0);
  const totalClasses = ATTENDANCE.reduce((s, a) => s + a.total, 0);
  const overallPct = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  const displayed = filter === 'low'
    ? ATTENDANCE.filter(a => a.total > 0 && Math.round(a.attended / a.total * 100) < 75)
    : ATTENDANCE.filter(a => a.total > 0);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.pageTitle}>Attendance</Text>
        <Text style={s.semester}>Semester 5 · 2026–27</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={s.content} contentContainerStyle={s.scroll}>

        {/* Overall card */}
        <View style={s.overallCard}>
          <View style={[s.circle, { borderColor: getColor(overallPct) }]}>
            <Text style={[s.circlePct, { color: getColor(overallPct) }]}>{overallPct}%</Text>
            <Text style={s.circleLabel}>Overall</Text>
          </View>
          <View style={s.overallRight}>
            <Text style={s.overallTitle}>Attendance Summary</Text>
            <Text style={s.overallSub}>
              {ATTENDANCE.filter(a => a.total > 0 && Math.round(a.attended / a.total * 100) >= 75).length} subjects safe ✅
            </Text>
            <Text style={s.overallSub}>
              {ATTENDANCE.filter(a => a.total > 0 && Math.round(a.attended / a.total * 100) < 75).length} subjects at risk ⚠️
            </Text>
          </View>
        </View>

        {/* Filter pills */}
        <View style={s.filterRow}>
          {(['all', 'low'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[s.filterBtn, filter === f && s.filterActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.filterText, filter === f && s.filterTextActive]}>
                {f === 'all' ? 'All Subjects' : '⚠️ At Risk'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Subject cards */}
        {displayed.map((a, i) => (
          <AttendanceBar key={i} subjectCode={a.subjectCode} attended={a.attended} total={a.total} />
        ))}

        {displayed.length === 0 && (
          <View style={s.emptyState}>
            <Text style={s.emptyEmoji}>🎉</Text>
            <Text style={s.emptyText}>All subjects above 75%!</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: T.bg },
  pageTitle: { fontSize: T.font.heading, fontWeight: '800', color: T.light },
  semester: { fontSize: 13, color: T.muted, marginTop: 4 },

  content: {
    flex: 1, backgroundColor: T.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 },

  // Overall card
  overallCard: {
    backgroundColor: T.light, borderRadius: T.radius, padding: 20,
    flexDirection: 'row', alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  circle: {
    width: 88, height: 88, borderRadius: 44, borderWidth: 4,
    alignItems: 'center', justifyContent: 'center', marginRight: 20,
  },
  circlePct: { fontSize: 24, fontWeight: '700' },
  circleLabel: { fontSize: 11, color: T.muted },
  overallRight: { flex: 1 },
  overallTitle: { fontSize: 16, fontWeight: '700', color: T.black, marginBottom: 8 },
  overallSub: { fontSize: 13, color: T.muted, marginBottom: 4 },

  // Filters
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  filterBtn: {
    flex: 1, backgroundColor: T.light, borderRadius: T.radiusPill, paddingVertical: 10,
    alignItems: 'center', borderWidth: 1, borderColor: T.muted + '30',
  },
  filterActive: { backgroundColor: T.accent, borderColor: T.accent },
  filterText: { fontSize: 13, color: T.muted, fontWeight: '600' },
  filterTextActive: { color: T.light },

  // Subject card
  card: {
    backgroundColor: T.light, borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  subjectName: { fontSize: 15, fontWeight: '600', color: T.black },
  facultyName: { fontSize: 12, color: T.muted, marginTop: 3 },
  badge: { borderRadius: T.radiusPill, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  badgeText: { fontSize: 13, fontWeight: '700' },

  barBg: { height: 8, backgroundColor: T.muted + '20', borderRadius: T.radiusPill, marginBottom: 10, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: T.radiusPill },

  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  countText: { fontSize: 12, color: T.muted },
  warningText: { fontSize: 11, fontWeight: '600' },

  emptyState: { alignItems: 'center', paddingTop: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: T.muted, fontWeight: '500' },
});
