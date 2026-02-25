import { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, Pressable, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { createTour } from '@/src/api/turCreate';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';

const ULASIM_OPTIONS = ['Otobüs', 'Uçak', 'Tren', 'Gemi'];
const YURTICI_OPTIONS = ['Yurtiçi', 'Yurtdışı'];

export default function TurEkleScreen() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [isim, setIsim] = useState('');
  const [turKodu, setTurKodu] = useState('');
  const [yurticiDisi, setYurticiDisi] = useState('Yurtiçi');
  const [geceSayisi, setGeceSayisi] = useState('');
  const [kalkisSehir, setKalkisSehir] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [operator, setOperator] = useState('');
  const [ulasimTipi, setUlasimTipi] = useState('');
  const [konaklama, setKonaklama] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [aktif, setAktif] = useState(true);
  const [b2c, setB2c] = useState(true);
  const [b2b, setB2b] = useState(true);
  const [gunubirlik, setGunubirlik] = useState(false);

  const handleSubmit = async () => {
    if (!isim.trim()) {
      Alert.alert('Hata', 'Tur ismi zorunludur.');
      return;
    }

    setLoading(true);
    try {
      await createTour({
        isim: isim.trim(),
        tur_kodu: turKodu.trim() || undefined,
        yurtici_disi: yurticiDisi,
        gece_sayisi: gunubirlik ? 0 : parseInt(geceSayisi) || 0,
        kalkis_sehir: kalkisSehir.trim(),
        aciklama: aciklama.trim() || undefined,
        operator: operator.trim() || undefined,
        ulasim_tipi: ulasimTipi || undefined,
        konaklama: konaklama.trim() || undefined,
        baslangic_fiyati_tl: fiyat ? parseFloat(fiyat) : undefined,
        aktif,
        b2c_yayinla: b2c,
        b2b_yayinla: b2b,
        gunubirlik,
      });
      queryClient.invalidateQueries({ queryKey: ['turlar'] });
      Alert.alert('Başarılı', 'Tur başarıyla eklendi.', [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tur eklenemedi.';
      Alert.alert('Hata', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Tur İsmi */}
        <Text style={styles.label}>Tur İsmi *</Text>
        <TextInput style={styles.input} value={isim} onChangeText={setIsim} placeholder="Ör: Kapadokya Turu" placeholderTextColor={Colors.textMuted} />

        {/* Tur Kodu */}
        <Text style={styles.label}>Tur Kodu</Text>
        <TextInput style={styles.input} value={turKodu} onChangeText={setTurKodu} placeholder="Otomatik oluşturulur" placeholderTextColor={Colors.textMuted} autoCapitalize="characters" />

        {/* Yurtiçi / Yurtdışı */}
        <Text style={styles.label}>Yurtiçi / Yurtdışı</Text>
        <View style={styles.chipRow}>
          {YURTICI_OPTIONS.map((opt) => (
            <Pressable
              key={opt}
              style={[styles.chip, yurticiDisi === opt && styles.chipActive]}
              onPress={() => setYurticiDisi(opt)}
            >
              <Text style={[styles.chipText, yurticiDisi === opt && styles.chipTextActive]}>{opt}</Text>
            </Pressable>
          ))}
        </View>

        {/* Günübirlik */}
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Günübirlik Tur</Text>
          <Switch
            value={gunubirlik}
            onValueChange={setGunubirlik}
            trackColor={{ true: Colors.primary }}
            thumbColor="#fff"
          />
        </View>

        {/* Gece Sayısı */}
        {!gunubirlik && (
          <>
            <Text style={styles.label}>Gece Sayısı</Text>
            <TextInput style={styles.input} value={geceSayisi} onChangeText={setGeceSayisi} placeholder="0" placeholderTextColor={Colors.textMuted} keyboardType="number-pad" />
          </>
        )}

        {/* Kalkış Şehri */}
        <Text style={styles.label}>Kalkış Şehri</Text>
        <TextInput style={styles.input} value={kalkisSehir} onChangeText={setKalkisSehir} placeholder="Ör: İstanbul" placeholderTextColor={Colors.textMuted} />

        {/* Ulaşım Tipi */}
        <Text style={styles.label}>Ulaşım Tipi</Text>
        <View style={styles.chipRow}>
          {ULASIM_OPTIONS.map((opt) => (
            <Pressable
              key={opt}
              style={[styles.chip, ulasimTipi === opt && styles.chipActive]}
              onPress={() => setUlasimTipi(ulasimTipi === opt ? '' : opt)}
            >
              <Text style={[styles.chipText, ulasimTipi === opt && styles.chipTextActive]}>{opt}</Text>
            </Pressable>
          ))}
        </View>

        {/* Operatör */}
        <Text style={styles.label}>Operatör</Text>
        <TextInput style={styles.input} value={operator} onChangeText={setOperator} placeholder="Ör: Firma adı" placeholderTextColor={Colors.textMuted} />

        {/* Konaklama */}
        <Text style={styles.label}>Konaklama</Text>
        <TextInput style={styles.input} value={konaklama} onChangeText={setKonaklama} placeholder="Ör: 4 Yıldızlı Otel" placeholderTextColor={Colors.textMuted} />

        {/* Başlangıç Fiyatı */}
        <Text style={styles.label}>Başlangıç Fiyatı (₺)</Text>
        <TextInput style={styles.input} value={fiyat} onChangeText={setFiyat} placeholder="0" placeholderTextColor={Colors.textMuted} keyboardType="decimal-pad" />

        {/* Açıklama */}
        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={aciklama}
          onChangeText={setAciklama}
          placeholder="Tur hakkında kısa açıklama..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Yayın Ayarları */}
        <Text style={styles.sectionTitle}>Yayın Ayarları</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Aktif</Text>
          <Switch value={aktif} onValueChange={setAktif} trackColor={{ true: Colors.primary }} thumbColor="#fff" />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>B2C Yayınla</Text>
          <Switch value={b2c} onValueChange={setB2c} trackColor={{ true: Colors.primary }} thumbColor="#fff" />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>B2B Yayınla</Text>
          <Switch value={b2b} onValueChange={setB2b} trackColor={{ true: Colors.primary }} thumbColor="#fff" />
        </View>

        {/* Submit */}
        <Pressable
          style={[styles.submitBtn, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.submitText}>Tur Ekle</Text>
            </>
          )}
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: 60 },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6, marginTop: Spacing.md },
  input: {
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#4a4a4a',
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: '#4a4a4a',
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  switchLabel: { fontSize: FontSize.md, color: Colors.textPrimary },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  submitBtn: {
    flexDirection: 'row',
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },
});
