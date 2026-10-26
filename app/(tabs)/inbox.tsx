import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { T } from '../../src/theme';

export default function InboxScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.title}>Inbox</Text>
      </View>
      <View style={s.content}>
        <View style={s.empty}>
          <Text style={s.emptyEmoji}>💬</Text>
          <Text style={s.emptyTitle}>No messages yet</Text>
          <Text style={s.emptySub}>Notices and messages will appear here</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, backgroundColor: T.bg },
  title: { fontSize: T.font.heading, fontWeight: '800', color: T.light },
  content: {
    flex: 1, backgroundColor: T.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 32,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: T.font.title, fontWeight: '700', color: T.black, marginBottom: 8 },
  emptySub: { fontSize: T.font.body, color: T.muted },
});
