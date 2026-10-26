import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity,
  View, SafeAreaView, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { SUBJECTS, ATTENDANCE } from '../../src/data';
import { T, ATTENDANCE_THRESHOLD } from '../../src/theme';
import ProgressRing from '../../src/components/ProgressRing';
import { useAuth } from '../../src/services/auth';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ── Attendance math helpers ───────────────────────────────────────────────────

/** How many classes can the student skip and still stay at/above threshold */
function canBunk(attended: number, total: number): number {
  if (total === 0) return 0;
  return Math.max(0, Math.floor(attended / ATTENDANCE_THRESHOLD - total));
}

/** How many consecutive classes must the student attend to reach threshold */
function mustAttend(attended: number, total: number): number {
  if (total === 0) return 0;
  // (attended + x) / (total + x) >= 0.75
  // attended + x >= 0.75 * total + 0.75 * x
  // 0.25 * x >= 0.75 * total - attended
  // x >= (3*total - 4*attended)
  return Math.max(0, 3 * total - 4 * attended);
}

function getPctColor(pct: number, total: number): string {
  if (total === 0) return T.muted;
  if (pct >= 75) return T.success;
  return T.danger;
}

// ── Subject Card ──────────────────────────────────────────────────────────────

function SubjectCard({ subjectCode, attended, total }: {
  subjectCode: string; attended: number; total: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const subject = SUBJECTS.find(s => s.code === subjectCode);
  const pct = total > 0 ? (attended / total) * 100 : 0;
  const pctRounded = total > 0 ? parseFloat(pct.toFixed(1)) : 0;
  const color = getPctColor(pct, total);
  const notUpdated = total === 0;

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  }

  const bunkable = canBunk(attended, total);
  const needed = mustAttend(attended, total);

  return (
    <TouchableOpacity style={s.card} onPress={toggle} activeOpacity={0.7}>
      {/* Top row: info + ring */}
      <View style={s.cardRow}>
        <View style={s.cardInfo}>
          <Text style={s.courseCode}>{subjectCode} CSOT-CSOT</Text>
          {notUpdated ? (
            <Text style={s.notUpdated}>
              {subject?.name ?? subjectCode} – Attendance has not been updated by the Faculty
            </Text>
          ) : (
            <Text style={s.subjectDetail}>
              {subject?.name ?? subjectCode}-{attended}/{total}
            </Text>
          )}
        </View>

        {/* Circular ring */}
        <View style={s.ringWrap}>
          <ProgressRing
            size={54}
            strokeWidth={4}
            percent={pctRounded}
            color={color}
            bgColor={T.muted + '30'}
          />
          <View style={s.ringCenter}>
            <Text style={[s.ringPct, { color }]}>
              {notUpdated ? '0' : pctRounded}
            </Text>
          </View>
        </View>
      </View>

      {/* Expanded details */}
      {expanded && !notUpdated && (
        <View style={s.expandedBox}>
          <View style={s.expandedRow}>
            <Text style={s.expandedLabel}>Percentage</Text>
            <Text style={[s.expandedValue, { color }]}>{pctRounded}%</Text>
          </View>
          <View style={s.expandedRow}>
            <Text style={s.expandedLabel}>Classes attended</Text>
            <Text style={s.expandedValue}>{attended} / {total}</Text>
          </View>
          <View style={s.divider} />
          {pct >= 75 ? (
            <View style={s.expandedRow}>
              <Text style={s.expandedLabel}>🎉 Can bunk next</Text>
              <Text style={[s.expandedValue, { color: T.success }]}>{bunkable} classes</Text>
            </View>
          ) : (
            <View style={s.expandedRow}>
              <Text style={s.expandedLabel}>⚠️ Must attend next</Text>
              <Text style={[s.expandedValue, { color: T.danger }]}>{needed} classes</Text>
            </View>
          )}
          {pct >= 75 && needed === 0 && (
            <Text style={s.safeText}>✅ You're safe — above {ATTENDANCE_THRESHOLD * 100}%</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function AttendanceScreen() {
  const { student } = useAuth();
  const [filter, setFilter] = useState<'all' | 'low'>('all');

  // Overall stats (exclude subjects with total=0)
  const withData = ATTENDANCE.filter(a => a.total > 0);
  const totalAttended = withData.reduce((s, a) => s + a.attended, 0);
  const totalClasses = withData.reduce((s, a) => s + a.total, 0);
  const overallPct = totalClasses > 0 ? parseFloat(((totalAttended / totalClasses) * 100).toFixed(1)) : 0;

  const displayed = filter === 'low'
    ? ATTENDANCE.filter(a => a.total > 0 && (a.attended / a.total) * 100 < 75)
    : ATTENDANCE;

  return (
    <SafeAreaView style={s.safe}>
      {/* Dark header */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.headerName}>{student.name}</Text>
            <Text style={s.headerSub}>
              Student | {student.college}
            </Text>
            <Text style={s.headerSub}>{student.batch} odd</Text>
          </View>
          {/* Overall ring in header */}
          <View style={s.headerRingWrap}>
            <ProgressRing
              size={56}
              strokeWidth={4}
              percent={overallPct}
              color={getPctColor(overallPct, totalClasses)}
              bgColor={T.muted + '40'}
            />
            <View style={s.headerRingCenter}>
              <Text style={s.headerRingPct}>{overallPct}%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cream content area */}
      <View style={s.content}>
        <Text style={s.sectionTitle}>ATTENDANCE REPORT</Text>

        {/* Filter pills */}
        <View style={s.filterRow}>
          {(['all', 'low'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[s.filterBtn, filter === f && s.filterActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.filterText, filter === f && s.filterTextActive]}>
                {f === 'all' ? 'All' : '⚠️ At Risk'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          {displayed.map((a, i) => (
            <SubjectCard key={i} subjectCode={a.subjectCode} attended={a.attended} total={a.total} />
          ))}

          {displayed.length === 0 && (
            <View style={s.emptyState}>
              <Text style={s.emptyEmoji}>🎉</Text>
              <Text style={s.emptyText}>All subjects above 75%!</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  // Header (dark area matching screenshot)
  header: { backgroundColor: T.bg, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerName: { fontSize: 18, fontWeight: '700', color: T.light },
  headerSub: { fontSize: 12, color: T.muted, marginTop: 2 },
  headerRingWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  headerRingCenter: {
    position: 'absolute', alignItems: 'center', justifyContent: 'center',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  headerRingPct: { fontSize: 14, fontWeight: '800', color: T.light },

  // Content (cream area)
  content: {
    flex: 1, backgroundColor: T.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: '300', color: T.muted,
    textAlign: 'center', marginBottom: 12, letterSpacing: 3,
  },
  scroll: { paddingHorizontal: 18, paddingBottom: 32 },

  // Filters
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 18, marginBottom: 14 },
  filterBtn: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: T.radiusPill,
    backgroundColor: T.light, borderWidth: 1, borderColor: T.muted + '30',
  },
  filterActive: { backgroundColor: T.accent, borderColor: T.accent },
  filterText: { fontSize: 13, color: T.muted, fontWeight: '600' },
  filterTextActive: { color: T.light },

  // Subject card
  card: {
    backgroundColor: T.light, borderRadius: T.radius, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardInfo: { flex: 1, marginRight: 12 },
  courseCode: { fontSize: 15, fontWeight: '700', color: T.black, marginBottom: 4 },
  subjectDetail: { fontSize: 13, color: T.muted, lineHeight: 18 },
  notUpdated: { fontSize: 13, color: T.danger, lineHeight: 18 },

  // Ring inside card
  ringWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  ringCenter: {
    position: 'absolute', alignItems: 'center', justifyContent: 'center',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  ringPct: { fontSize: 13, fontWeight: '800' },

  // Expanded area
  expandedBox: {
    marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: T.muted + '20',
  },
  expandedRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 8,
  },
  expandedLabel: { fontSize: 13, color: T.muted },
  expandedValue: { fontSize: 14, fontWeight: '700', color: T.black },
  divider: { height: 1, backgroundColor: T.muted + '15', marginVertical: 6 },
  safeText: { fontSize: 13, color: T.success, fontWeight: '600', marginTop: 4 },

  // Empty state
  emptyState: { alignItems: 'center', paddingTop: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: T.muted, fontWeight: '500' },
});
