import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView,
  Platform, ActivityIndicator, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/src/auth/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Hata', 'E-posta ve şifre gereklidir.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Giriş başarısız.';
      Alert.alert('Giriş Hatası', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0f0507', '#1a0a0e', '#2d1118', '#1a0a0e', '#0f0507']}
      locations={[0, 0.2, 0.5, 0.8, 1]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Decorative circles */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />

        {/* Glass card - everything in one card */}
        <View style={styles.glassWrapper}>
          <BlurView intensity={20} tint="dark" style={styles.glassCard}>
            <View style={styles.glassInner}>
              <View style={styles.welcomeRow}>
                <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
                <View style={styles.logoClip}>
                  <Image
                    source={require('@/assets/logo.jpg')}
                    style={styles.miniLogo}
                    resizeMode="cover"
                  />
                </View>
              </View>
              <Text style={styles.welcomeSub}>Devam etmek için giriş yapın</Text>

              <View style={styles.inputGroup}>
                <TextInput
                  style={[
                    styles.input,
                    focused === 'email' && styles.inputFocused,
                  ]}
                  placeholder="E-posta adresiniz"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TextInput
                  style={[
                    styles.input,
                    focused === 'password' && styles.inputFocused,
                  ]}
                  placeholder="Şifreniz"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  secureTextEntry
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  loading && styles.buttonDisabled,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#A82040', '#8B1A2B', '#6B1520']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Giriş Yap</Text>
                  )}
                </LinearGradient>
              </Pressable>

              <Text style={styles.forgotText}>Şifremi Unuttum</Text>
            </View>
          </BlurView>
        </View>

        <Text style={styles.footer}>acentegre.com</Text>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.07,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: '#A82040',
    top: -60,
    right: -80,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: '#D4374B',
    bottom: 80,
    left: -60,
  },
  glassWrapper: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  glassCard: {
    width: '100%',
  },
  glassInner: {
    padding: 28,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  logoClip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  miniLogo: {
    width: 72,
    height: 72,
    marginTop: -8,
    marginLeft: -12,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },
  welcomeSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 32,
  },
  inputGroup: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  inputFocused: {
    borderColor: 'rgba(168, 32, 64, 0.6)',
    backgroundColor: 'rgba(168, 32, 64, 0.08)',
  },
  button: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#8B1A2B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  buttonGradient: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  forgotText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
    letterSpacing: 1.5,
  },
});
