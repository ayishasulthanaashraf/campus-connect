import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity,
  View, SafeAreaView, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { SUBJECTS, ATTENDANCE } from '../../src/data';
import { T, ATTENDANCE_THRESHOLD } from '../../src/theme';
import ProgressRing from '../../components/ProgressRing';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ── Attendance math ──────────────────────────────────────────────────────────
/** How many classes you can bunk and still stay at/above threshold */
function canBunk(attended: number, total: number): number {
  // attended / total ≥ T after bunking x → attended / (total+x) ≥ T → x ≤ attended/T - total
  return Math.max(0, Math.floor(attended / ATTENDANCE_THRESHOLD - total));
}

/** How many consecutive classes you MUST attend to reach threshold */
function mustAttend(attended: number, total: number): number {
  // (attended+x) / (total+x) ≥ T → x ≥ (T*total - attended) / (1-T) → x ≥ 3*total - 4*attended (for T=0.75)
  // General: x ≥ (T*total - attended) / (1 - T)
  const x = Math.ceil((ATTENDANCE_THRESHOLD * total - attended) / (1 - ATTENDANCE_THRESHOLD));
  return Math.max(0, x);
}

// ── Subject attendance card ──────────────────────────────────────────────────
function AttendanceCard({
  subjectCode, attended, total,
}: {
  subjectCode: string; attended: number; total: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const subject = SUBJECTS.find(s => s.code === subjectCode);
  const isNotUpdated = total === 0;
  const pct = total > 0 ? (attended / total) * 100 : 0;
  const pctRound = Math.round(pct * 10) / 10; // one decimal like screenshot

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity style={s.card} onPress={toggle} activeOpacity={0.7}>
      {/* Main row */}
      <View style={s.cardRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.courseCode}>{subjectCode} CSOT-CSOT</Text>
          {isNotUpdated ? (
            <Text style={s.notUpdated}>
              {subject?.name ?? subjectCode} –{'\n'}Attendance has not been updated by the Faculty
            </Text>
          ) : (
            <Text style={s.subjectDetail}>
              {subject?.name ?? subjectCode}-{attended}/{total}
            </Text>
          )}
        </View>

        <ProgressRing
          percent={pctRound}
          size={56}
          strokeWidth={4}
          disabled={isNotUpdated}
          showText={true}
        />
      </View>

      {/* Expanded details */}
      {expanded && !isNotUpdated && (
        <View style={s.expandedRow}>
          <View style={s.expandedItem}>
            <Text style={s.expandedLabel}>Can bunk</Text>
            <Text style={[s.expandedValue, { color: canBunk(attended, total) > 0 ? T.success : T.danger }]}>
              {canBunk(attended, total)} classes
            </Text>
          </View>
          <View style={s.expandedDivider} />
          <View style={s.expandedItem}>
            <Text style={s.expandedLabel}>Must attend</Text>
            <Text style={[s.expandedValue, { color: mustAttend(attended, total) > 0 ? T.danger : T.success }]}>
              {mustAttend(attended, total)} classes
            </Text>
          </View>
          <View style={s.expandedDivider} />
          <View style={s.expandedItem}>
            <Text style={s.expandedLabel}>Threshold</Text>
            <Text style={s.expandedValue}>{ATTENDANCE_THRESHOLD * 100}%</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────
export default function AttendanceScreen() {
  const totalAttended = ATTENDANCE.reduce((s, a) => s + a.attended, 0);
  const totalClasses = ATTENDANCE.reduce((s, a) => s + a.total, 0);
  const overallPct = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  return (
    <SafeAreaView style={s.safe}>
      {/* Dark header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Attendance Report</Text>
        <View style={s.overallRow}>
          <ProgressRing percent={overallPct} size={72} strokeWidth={5} showText={true} />
          <View style={s.overallInfo}>
            <Text style={s.overallLabel}>Overall Attendance</Text>
            <Text style={s.overallPct}>{overallPct}%</Text>
            <Text style={s.overallSub}>
              {totalAttended}/{totalClasses} hours · {ATTENDANCE.filter(a => a.total > 0).length} subjects
            </Text>
          </View>
        </View>
      </View>

      {/* Cream content panel */}
      <ScrollView
        style={s.content}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {ATTENDANCE.map((a, i) => (
          <AttendanceCard
            key={a.subjectCode}
            subjectCode={a.subjectCode}
            attended={a.attended}
            total={a.total}
          />
        ))}

        <Text style={s.footer}>
          Tap a subject for bunk/attend details{'\n'}
          Threshold: {ATTENDANCE_THRESHOLD * 100}% minimum required
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  // Header
  header: {
    backgroundColor: T.bg, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 22, fontWeight: '800', color: T.light, marginBottom: 18, letterSpacing: 0.3,
  },
  overallRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  overallInfo: { marginLeft: 20, flex: 1 },
  overallLabel: { fontSize: 12, color: T.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  overallPct: { fontSize: 32, fontWeight: '800', color: T.light, marginVertical: 2 },
  overallSub: { fontSize: 13, color: T.muted },

  // Content panel
  content: {
    flex: 1, backgroundColor: T.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  scroll: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 },

  // Card
  card: {
    backgroundColor: T.light, borderRadius: T.radius, padding: 16,
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  courseCode: {
    fontSize: 14, fontWeight: '700', color: T.black, marginBottom: 4,
  },
  subjectDetail: {
    fontSize: 13, color: T.muted, lineHeight: 18,
  },
  notUpdated: {
    fontSize: 13, color: T.danger, lineHeight: 18, fontStyle: 'italic',
  },

  // Expanded section
  expandedRow: {
    flexDirection: 'row', marginTop: 14, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: T.muted + '20',
  },
  expandedItem: { flex: 1, alignItems: 'center' },
  expandedDivider: { width: 1, backgroundColor: T.muted + '20' },
  expandedLabel: { fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: '500' },
  expandedValue: { fontSize: 15, fontWeight: '700', color: T.black },

  // Footer
  footer: {
    textAlign: 'center', fontSize: 12, color: T.muted, marginTop: 12, lineHeight: 18,
  },
});
