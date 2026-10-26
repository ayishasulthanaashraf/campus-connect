import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../src/services/auth';
import { T } from '../src/theme';

/**
 * Auth gate: redirects to login when logged out and to tabs when logged in.
 * Wraps Slot so expo-router still manages navigation.
 */
function AuthGate() {
  const { user, loading, useMock } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuth = segments[0] === '(auth)';

    // Not logged in (and not using demo/mock) → send to login
    if (!user && !useMock && !inAuth) {
      router.replace('/(auth)/login');
    }
    // Logged in (or demo) but still on auth screen → send to tabs
    if ((user || useMock) && inAuth) {
      router.replace('/(tabs)/home');
    }
  }, [user, loading, useMock, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={T.accent} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AuthGate />
    </AuthProvider>
  );
}
