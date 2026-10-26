import { Redirect } from 'expo-router';
import { useAuth } from '../src/services/auth';

/**
 * Root index — redirects based on auth state.
 * The real auth gating lives in _layout.tsx; this is just the entry-point redirect.
 */
export default function Index() {
  const { user, useMock } = useAuth();

  if (user || useMock) {
    return <Redirect href="/(tabs)/home" />;
  }
  return <Redirect href="/(auth)/login" />;
}
