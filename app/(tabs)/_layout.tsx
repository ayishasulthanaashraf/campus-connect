import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { T } from '../../src/theme';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={[ti.wrap, focused && ti.wrapActive]}>
      <Text style={ti.emoji}>{emoji}</Text>
      <Text style={[ti.label, focused && ti.labelActive]}>{label}</Text>
    </View>
  );
}

const ti = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: 6, paddingHorizontal: 4, borderRadius: 12, minWidth: 56 },
  wrapActive: { backgroundColor: T.bg + '18' },
  emoji: { fontSize: 22 },
  label: { fontSize: 10, color: T.muted, marginTop: 2, fontWeight: '500' },
  labelActive: { color: T.accent, fontWeight: '700' },
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: T.surface,
          borderTopColor: T.muted + '30',
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 4,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Attendance" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="timetable"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗓️" label="Timetable" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Inbox" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
