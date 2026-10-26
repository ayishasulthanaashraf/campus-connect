import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bgOuter:     '#C5C4C0',
  bgCard:      '#D9D8D4',
  bgInput:     '#E2E1DD',
  border:      '#A9A5A2',
  borderStrong:'#938D86',
  brand:       '#7E8E8E',
  textPrimary: '#3A3A3A',
  textMuted:   '#7E8E8E',
  textHint:    '#A6A4A0',
  white:       '#FFFFFF',
  error:       '#C0392B',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
type Mode = 'login' | 'signup';

function isValidRegNumber(v: string) {
  return /^[A-Za-z0-9]{4,15}$/.test(v.trim());
}

// ── Google G button ───────────────────────────────────────────────────────────
function GoogleButton({ onPress, loading }: { onPress: () => void; loading: boolean }) {
  return (
    <TouchableOpacity
      style={gs.btn}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.75}
      accessibilityLabel="Sign in with Google college email"
    >
      {loading ? (
        <ActivityIndicator color={C.brand} size="small" />
      ) : (
        <View style={gs.inner}>
          <Text style={gs.G}>G</Text>
          <View style={gs.dots}>
            {['#4285F4','#EA4335','#FBBC05','#34A853'].map((col, i) => (
              <View key={i} style={[gs.dot, { backgroundColor: col }]} />
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const gs = StyleSheet.create({
  btn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: C.bgCard,
    borderWidth: 1.5, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  inner: { alignItems: 'center' },
  G:    { fontSize: 24, fontWeight: '700', color: '#4285F4', lineHeight: 28 },
  dots: { flexDirection: 'row', gap: 2, marginTop: 2 },
  dot:  { width: 4, height: 4, borderRadius: 2 },
});

// ── Main screen ───────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode]         = useState<Mode>('login');
  const [regNum, setRegNum]     = useState('');
  const [password, setPass]     = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const [regErr,  setRegErr]  = useState('');
  const [passErr, setPassErr] = useState('');
  const [confErr, setConfErr] = useState('');

  const isSignup = mode === 'signup';

  function clearAll() {
    setRegErr(''); setPassErr(''); setConfErr('');
    setRegNum(''); setPass(''); setConfirm('');
  }

  function validate() {
    let ok = true;
    setRegErr(''); setPassErr(''); setConfErr('');

    if (!regNum.trim()) {
      setRegErr('Registration number is required.'); ok = false;
    } else if (!isValidRegNumber(regNum)) {
      setRegErr('Enter your valid registration number (e.g. 21CSC045).'); ok = false;
    }
    if (!password) {
      setPassErr('Password is required.'); ok = false;
    } else if (password.length < 8) {
      setPassErr('Password must be at least 8 characters.'); ok = false;
    }
    if (isSignup) {
      if (!confirm) {
        setConfErr('Please confirm your password.'); ok = false;
      } else if (confirm !== password) {
        setConfErr("Passwords don't match."); ok = false;
      }
    }
    return ok;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 900)); // ← replace with Firebase call
      Alert.alert(
        '✅ UI working!',
        `Firebase not connected yet.\n\nNext step: set up Firebase and paste your config into lib/firebase.ts`,
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGLoading(true);
    try {
      await new Promise(r => setTimeout(r, 900)); // ← replace with Google OAuth
      Alert.alert('✅ Google button works!', 'Firebase Google Sign-In coming next.');
    } finally {
      setGLoading(false);
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" backgroundColor={C.bgOuter} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* App name */}
          <Text style={s.appName}>Campus Connect</Text>
          <Text style={s.tagline}>Your college, connected.</Text>

          {/* Card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>
              {isSignup ? 'Create Account' : 'Welcome back'}
            </Text>

            {/* Reg number */}
            <Text style={s.label}>Registration Number</Text>
            <TextInput
              style={[s.input, regErr && s.inputErr]}
              placeholder="e.g. 21CSC045"
              placeholderTextColor={C.textHint}
              value={regNum}
              onChangeText={v => { setRegNum(v); setRegErr(''); }}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            {!!regErr && <Text style={s.err}>{regErr}</Text>}

            {/* Password */}
            <Text style={s.label}>Password</Text>
            <TextInput
              style={[s.input, passErr && s.inputErr]}
              placeholder="Enter password"
              placeholderTextColor={C.textHint}
              value={password}
              onChangeText={v => { setPass(v); setPassErr(''); }}
              secureTextEntry
            />
            {!!passErr && <Text style={s.err}>{passErr}</Text>}

            {/* Confirm (signup only) */}
            {isSignup && (
              <>
                <Text style={s.label}>Confirm Password</Text>
                <TextInput
                  style={[s.input, confErr && s.inputErr]}
                  placeholder="Re-enter password"
                  placeholderTextColor={C.textHint}
                  value={confirm}
                  onChangeText={v => { setConfirm(v); setConfErr(''); }}
                  secureTextEntry
                />
                {!!confErr && <Text style={s.err}>{confErr}</Text>}
              </>
            )}

            {/* Forgot */}
            {!isSignup && (
              <TouchableOpacity style={s.forgotRow}>
                <Text style={s.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {/* Login / Sign-up button */}
            <TouchableOpacity
              style={[s.primaryBtn, loading && s.btnOff]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading
                ? <ActivityIndicator color={C.white} />
                : <Text style={s.primaryBtnText}>{isSignup ? 'Create Account' : 'Login'}</Text>
              }
            </TouchableOpacity>

            {/* Divider */}
            <View style={s.divRow}>
              <View style={s.divLine} />
              <Text style={s.divText}>or sign in with college email</Text>
              <View style={s.divLine} />
            </View>

            {/* Google button */}
            <GoogleButton onPress={handleGoogle} loading={gLoading} />

            {/* Mode toggle */}
            <View style={s.toggleRow}>
              <Text style={s.toggleText}>
                {isSignup ? 'Already have an account?  ' : "Don't have an account?  "}
              </Text>
              <TouchableOpacity onPress={() => { setMode(isSignup ? 'login' : 'signup'); clearAll(); }}>
                <Text style={s.toggleLink}>{isSignup ? 'Login' : 'Sign up'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bgOuter },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },

  appName: { fontSize: 30, fontWeight: '700', color: C.brand, textAlign: 'center', marginBottom: 4, letterSpacing: 0.5 },
  tagline: { fontSize: 14, color: C.textMuted, textAlign: 'center', marginBottom: 32 },

  card: {
    backgroundColor: C.bgCard, borderRadius: 24,
    borderWidth: 1, borderColor: C.borderStrong,
    paddingHorizontal: 28, paddingVertical: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
  },
  cardTitle: { fontSize: 22, fontWeight: '600', color: C.brand, marginBottom: 24 },

  label:    { fontSize: 13, fontWeight: '500', color: C.textMuted, marginBottom: 6, marginLeft: 4 },
  input: {
    backgroundColor: C.bgInput, borderWidth: 1, borderColor: C.border,
    borderRadius: 999, paddingVertical: 13, paddingHorizontal: 20,
    fontSize: 15, color: C.textPrimary, marginBottom: 4,
  },
  inputErr: { borderColor: C.error, borderWidth: 1.5 },
  err:      { fontSize: 12, color: C.error, marginLeft: 8, marginBottom: 8 },

  forgotRow:  { alignSelf: 'flex-end', marginTop: 4, marginBottom: 20 },
  forgotText: { fontSize: 13, color: C.brand, fontWeight: '500' },

  primaryBtn: {
    backgroundColor: C.brand, borderRadius: 999, paddingVertical: 15,
    alignItems: 'center', marginTop: 8,
    shadowColor: C.brand, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  btnOff:        { opacity: 0.6 },
  primaryBtnText:{ color: C.white, fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },

  divRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  divLine:{ flex: 1, height: 1, backgroundColor: C.border },
  divText:{ marginHorizontal: 10, fontSize: 12, color: C.textMuted, textAlign: 'center', flexShrink: 1 },

  toggleRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  toggleText: { fontSize: 14, color: C.textMuted },
  toggleLink: { fontSize: 14, color: C.brand, fontWeight: '600' },
});
