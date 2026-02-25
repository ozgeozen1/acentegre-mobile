import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

const STATUS_MAP: Record<string, { label: string; bg: string }> = {
  beklemede: { label: 'Beklemede', bg: Colors.orange },
  on_kayit: { label: 'Ön Kayıt', bg: Colors.orange },
  onaylandi: { label: 'Onaylandı', bg: Colors.success },
  tamamlandi: { label: 'Tamamlandı', bg: Colors.success },
  iptal_edildi: { label: 'İptal', bg: Colors.accent },
  odeme_bekliyor: { label: 'Ödeme Bekliyor', bg: Colors.textMuted },
};

export default function StatusBadge({ durum }: { durum: string | undefined }) {
  const s = STATUS_MAP[durum || ''] || { label: durum || '-', bg: Colors.textMuted };
  return (
    <View style={[styles.badge, { backgroundColor: s.bg + '20' }]}>
      <Text style={[styles.text, { color: s.bg }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
