import { useState } from 'react';
import { View, Text, FlatList, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useReservations } from '@/src/hooks/queries';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/src/utils/format';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import type { Rezervasyon } from '@/src/api/operasyon';

const FILTERS = [
  { label: 'Tümü', value: undefined },
  { label: 'Beklemede', value: 'beklemede' },
  { label: 'Onaylandı', value: 'onaylandi' },
  { label: 'İptal', value: 'iptal_edildi' },
] as const;

export default function OperasyonScreen() {
  const [selectedDurum, setSelectedDurum] = useState<string | undefined>(undefined);
  const { data, isLoading, error, refetch, isRefetching } = useReservations(selectedDurum);

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.accent} />
        <Text style={styles.errorText}>Rezervasyonlar yüklenemedi</Text>
        <Pressable style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {FILTERS.map((f) => {
          const active = selectedDurum === f.value;
          return (
            <Pressable
              key={f.label}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSelectedDurum(f.value)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={data || []}
        keyExtractor={(item) => item._id || item.id || item.pnr}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="clipboard-outline" message="Rezervasyon bulunamadı" />}
        renderItem={({ item }) => <RezCard rez={item} />}
      />
    </View>
  );
}

function RezCard({ rez }: { rez: Rezervasyon }) {
  const tutar = rez.toplam_tutar || rez.fiyat?.toplam;
  const paraBirimi = rez.para_birimi || rez.fiyat?.para_birimi;
  const durum = rez.durum || rez.rezervasyon_durumu;
  const tarih = rez.cikis_tarihi || rez.olusturma_tarihi || rez.created_at;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.pnr}>{rez.pnr}</Text>
        <StatusBadge durum={durum} />
      </View>
      <Text style={styles.musteri} numberOfLines={1}>
        {rez.musteri ? `${rez.musteri.ad} ${rez.musteri.soyad}` : '-'}
      </Text>
      <Text style={styles.turAdi} numberOfLines={1}>{rez.tur_adi || rez.tur_ismi || '-'}</Text>
      <View style={styles.cardBottom}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.dateText}>{formatDate(tarih)}</Text>
        </View>
        {tutar != null && (
          <Text style={styles.price}>{formatCurrency(tutar, paraBirimi)}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorText: { fontSize: FontSize.md, color: Colors.textMuted, marginTop: Spacing.md },
  retryBtn: { marginTop: Spacing.md, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.primary, borderRadius: Radius.md },
  retryText: { color: Colors.white, fontWeight: '600' },
  filterRow: { maxHeight: 52 },
  filterContent: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: Colors.white },
  list: { padding: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: '#4a4a4a',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  pnr: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  musteri: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 2 },
  turAdi: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 8 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: FontSize.xs, color: Colors.textMuted },
  price: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
});
