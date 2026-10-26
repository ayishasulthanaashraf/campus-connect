import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { SUBJECTS, TIMETABLE as TT_DATA } from '../../src/data';
import { T } from '../../src/theme';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TYPE_COLORS: Record<string, string> = {
  lecture: T.accent,
  lab: '#7B5EA7',
  free: T.muted,
};

function todayIndex() {
  const d = new Date().getDay();
  return d === 0 || d === 7 ? 0 : d - 1;
}

export default function TimetableScreen() {
  const [selectedDay, setSelectedDay] = useState(todayIndex());
  const periods = TT_DATA[DAYS[selectedDay]] ?? [];

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.pageTitle}>Timetable</Text>
        <Text style={s.semester}>Semester 5 · 2026–27</Text>
      </View>

      {/* Day selector */}
      <View style={s.dayBarWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dayRow}>
          {DAYS.map((day, i) => {
            const isToday = i === todayIndex();
            const isSelected = i === selectedDay;
            return (
              <TouchableOpacity
                key={day}
                style={[s.dayBtn, isSelected && s.dayBtnActive]}
                onPress={() => setSelectedDay(i)}
              >
                <Text style={[s.dayText, isSelected && s.dayTextActive]}>{day}</Text>
                {isToday && <View style={[s.todayDot, isSelected && { backgroundColor: T.light }]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Classes list */}
      <ScrollView showsVerticalScrollIndicator={false} style={s.content} contentContainerStyle={s.scroll}>
        {periods.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyEmoji}>🎉</Text>
            <Text style={s.emptyText}>No classes today!</Text>
          </View>
        ) : (
          periods.map((period, i) => {
            const subj = SUBJECTS.find(s => s.code === period.subjectCode);
            const typeColor = TYPE_COLORS[period.type] ?? T.muted;
            return (
              <View key={i} style={s.classRow}>
                {/* Time column */}
                <View style={s.timeCol}>
                  <Text style={s.timeText}>{period.startTime}</Text>
                  <Text style={s.timeSep}>|</Text>
                  <Text style={s.timeText}>{period.endTime}</Text>
                </View>

                {/* Connector */}
                <View style={s.connectorWrap}>
                  <View style={[s.dot, { backgroundColor: typeColor }]} />
                  {i < periods.length - 1 && <View style={s.line} />}
                </View>

                {/* Card */}
                <View style={[s.card, period.type === 'free' && s.cardFree]}>
                  <View style={s.cardHeaderRow}>
                    <Text style={[s.typePill, { backgroundColor: typeColor + '22', color: typeColor }]}>
                      {period.type === 'lab' ? '🔬 Lab' : period.type === 'free' ? '☕ Free' : '📖 Lecture'}
                    </Text>
                    <Text style={s.roomText}>📍 {period.room}</Text>
                  </View>
                  <Text style={s.subjectName}>{subj?.name ?? period.subjectCode}</Text>
                  {subj?.faculty && subj.faculty !== '—' && (
                    <Text style={s.facultyText}>{subj.faculty}</Text>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: { paddingHorizontal: 24, paddingTop: 16, backgroundColor: T.bg },
  pageTitle: { fontSize: T.font.heading, fontWeight: '800', color: T.light },
  semester: { fontSize: 13, color: T.muted, marginTop: 4 },

  // Day bar
  dayBarWrap: { backgroundColor: T.bg, paddingTop: 16, paddingBottom: 16 },
  dayRow: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  dayBtn: {
    paddingHorizontal: 18, paddingVertical: 12, borderRadius: T.radius,
    backgroundColor: T.surface, borderWidth: 1, borderColor: T.muted + '30',
    alignItems: 'center',
  },
  dayBtnActive: { backgroundColor: T.accent, borderColor: T.accent },
  dayText: { fontSize: 14, fontWeight: '600', color: T.muted },
  dayTextActive: { color: T.light },
  todayDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: T.accent, marginTop: 3 },

  // Content panel
  content: {
    flex: 1, backgroundColor: T.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 },
  classRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },

  timeCol: { width: 52, alignItems: 'center', paddingTop: 12 },
  timeText: { fontSize: 10, color: T.muted, fontWeight: '600', textAlign: 'center' },
  timeSep: { fontSize: 10, color: T.muted + '40', marginVertical: 1 },

  connectorWrap: { width: 24, alignItems: 'center', paddingTop: 14 },
  dot: { width: 12, height: 12, borderRadius: 6, zIndex: 1 },
  line: { width: 2, flex: 1, backgroundColor: T.muted + '30', marginTop: 4, minHeight: 30 },

  card: {
    flex: 1, backgroundColor: T.light, borderRadius: 16, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  cardFree: { backgroundColor: T.surface, opacity: 0.7 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  typePill: { fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: T.radiusPill },
  roomText: { fontSize: 11, color: T.muted },
  subjectName: { fontSize: 15, fontWeight: '600', color: T.black },
  facultyText: { fontSize: 12, color: T.muted, marginTop: 4 },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: T.muted },
});
