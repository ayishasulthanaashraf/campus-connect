import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface GoogleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
}

/**
 * Circular Google "G" button.
 * Fires onPress() which the login screen will use to trigger
 * the real Google OAuth flow once Firebase is wired up.
 */
export default function GoogleSignInButton({
  onPress,
  loading = false,
}: GoogleSignInButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={loading}
      accessibilityLabel="Sign in with Google"
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={Colors.brand} size="small" />
      ) : (
        <View style={styles.inner}>
          {/* Multi-colour Google G — built from plain Text segments */}
          <Text style={[styles.gLetter, { color: '#4285F4' }]}>G</Text>
          <View style={styles.dots}>
            <View style={[styles.dot, { backgroundColor: '#EA4335' }]} />
            <View style={[styles.dot, { backgroundColor: '#FBBC05' }]} />
            <View style={[styles.dot, { backgroundColor: '#34A853' }]} />
            <View style={[styles.dot, { backgroundColor: '#4285F4' }]} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gLetter: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  dots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
