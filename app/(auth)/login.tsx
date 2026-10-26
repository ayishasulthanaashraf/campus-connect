import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
  ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../../src/services/firebase';
import { useAuth } from '../../src/services/auth';
import { T } from '../../src/theme';

WebBrowser.maybeCompleteAuthSession();

type Mode = 'login' | 'signup';

const COLLEGE_DOMAIN = process.env.EXPO_PUBLIC_COLLEGE_DOMAIN ?? 'providence.edu.in';
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '';

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [regNo, setRegNo] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const syntheticEmail = `${regNo.trim().toLowerCase()}@campusconnect.app`;

  // ── Registration number auth ──
  async function handleRegNoAuth() {
    if (!regNo.trim() || !password) {
      Alert.alert('Missing fields', 'Enter your registration number and password.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      Alert.alert('Missing name', 'Enter your full name.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, syntheticEmail, password);
        await updateProfile(cred.user, { displayName: name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, syntheticEmail, password);
      }
      router.replace('/(tabs)/home');
    } catch (e: any) {
      const msg =
        e.code === 'auth/user-not-found' ? 'No account found. Sign up first.'
        : e.code === 'auth/wrong-password' ? 'Wrong password.'
        : e.code === 'auth/email-already-in-use' ? 'Already registered. Try logging in.'
        : e.code === 'auth/invalid-credential' ? 'Invalid credentials. Check reg no & password.'
        : e.message ?? 'Something went wrong.';
      Alert.alert('Auth Error', msg);
    } finally {
      setLoading(false);
    }
  }

  // ── Google sign-in (domain-restricted) ──
  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.IdToken,
      extraParams: { hd: COLLEGE_DOMAIN, nonce: 'campus' },
    },
    discovery,
  );

  React.useEffect(() => {
    if (response?.type !== 'success') return;
    const idToken = response.params.id_token;
    if (!idToken) return;

    (async () => {
      setGLoading(true);
      try {
        // Decode the id_token to check email domain (basic check)
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        const email: string = payload.email ?? '';
        if (!email.endsWith(`@${COLLEGE_DOMAIN}`)) {
          Alert.alert('Domain restricted', `Only @${COLLEGE_DOMAIN} accounts are allowed.`);
          return;
        }
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
        router.replace('/(tabs)/home');
      } catch (e: any) {
        Alert.alert('Google Sign-In Error', e.message ?? 'Something went wrong.');
      } finally {
        setGLoading(false);
      }
    })();
  }, [response]);

  async function handleGoogleSignIn() {
    if (!GOOGLE_CLIENT_ID) {
      Alert.alert(
        'Google Sign-In',
        `Set EXPO_PUBLIC_GOOGLE_CLIENT_ID in .env to enable.\nWill restrict to @${COLLEGE_DOMAIN} emails.`,
      );
      return;
    }
    setGLoading(true);
    try {
      await promptAsync();
    } catch {
      // user cancelled
    } finally {
      setGLoading(false);
    }
  }

  // Skip auth — demo mode with mock data
  function handleDemoMode() {
    router.replace('/(tabs)/home');
  }

  const isSignup = mode === 'signup';

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Dark header area */}
          <View style={s.header}>
            <Text style={s.logo}>◆</Text>
            <Text style={s.appName}>Campus Connect</Text>
            <Text style={s.tagline}>{isSignup ? 'Create your account' : 'Welcome back!'}</Text>
          </View>

          {/* Cream card */}
          <View style={s.card}>
            {isSignup && (
              <TextInput
                style={s.input}
                placeholder="Full Name"
                placeholderTextColor={T.muted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}

            <TextInput
              style={s.input}
              placeholder="Registration Number"
              placeholderTextColor={T.muted}
              value={regNo}
              onChangeText={setRegNo}
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <TextInput
              style={s.input}
              placeholder="Password"
              placeholderTextColor={T.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={s.primaryBtn} onPress={handleRegNoAuth} disabled={loading} activeOpacity={0.8}>
              {loading ? <ActivityIndicator color={T.light} /> : (
                <Text style={s.primaryBtnText}>{isSignup ? 'Sign Up' : 'Login'}</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={s.divRow}>
              <View style={s.divLine} />
              <Text style={s.divText}>or</Text>
              <View style={s.divLine} />
            </View>

            {/* Google */}
            <TouchableOpacity style={s.googleBtn} onPress={handleGoogleSignIn} disabled={gLoading} activeOpacity={0.8}>
              {gLoading ? <ActivityIndicator color={T.bg} /> : (
                <Text style={s.googleBtnText}>Continue with Google</Text>
              )}
            </TouchableOpacity>

            {/* Toggle mode */}
            <View style={s.toggleRow}>
              <Text style={s.toggleText}>
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
              </Text>
              <TouchableOpacity onPress={() => setMode(isSignup ? 'login' : 'signup')}>
                <Text style={s.toggleLink}>{isSignup ? 'Login' : 'Sign Up'}</Text>
              </TouchableOpacity>
            </View>

            {/* Demo mode */}
            <TouchableOpacity style={s.demoBtn} onPress={handleDemoMode}>
              <Text style={s.demoBtnText}>Explore Demo →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { flexGrow: 1 },

  header: { paddingTop: 60, paddingBottom: 40, alignItems: 'center', backgroundColor: T.bg },
  logo: { fontSize: 42, color: T.accent, marginBottom: 12 },
  appName: { fontSize: T.font.heading, fontWeight: '800', color: T.light, letterSpacing: 1 },
  tagline: { fontSize: T.font.body, color: T.muted, marginTop: 8 },

  card: {
    flex: 1, backgroundColor: T.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 28, paddingTop: 36, paddingBottom: 40,
  },
  input: {
    backgroundColor: T.light, borderRadius: T.radiusPill, paddingVertical: 14, paddingHorizontal: 20,
    fontSize: T.font.body, color: T.black, marginBottom: 14,
    borderWidth: 1, borderColor: T.muted + '40',
  },

  primaryBtn: {
    backgroundColor: T.accent, borderRadius: T.radiusPill, paddingVertical: 16,
    alignItems: 'center', marginTop: 6,
  },
  primaryBtnText: { color: T.light, fontSize: 16, fontWeight: '700' },

  divRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 22 },
  divLine: { flex: 1, height: 1, backgroundColor: T.muted + '40' },
  divText: { marginHorizontal: 14, fontSize: T.font.caption, color: T.muted },

  googleBtn: {
    backgroundColor: T.light, borderRadius: T.radiusPill, paddingVertical: 16,
    alignItems: 'center', borderWidth: 1.5, borderColor: T.bg,
  },
  googleBtnText: { color: T.bg, fontSize: 15, fontWeight: '700' },

  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  toggleText: { fontSize: 14, color: T.muted },
  toggleLink: { fontSize: 14, color: T.accent, fontWeight: '700' },

  demoBtn: { alignItems: 'center', marginTop: 20, paddingVertical: 10 },
  demoBtnText: { fontSize: 14, color: T.accent, fontWeight: '600', textDecorationLine: 'underline' },
});
