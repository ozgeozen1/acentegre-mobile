import { useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCariHesaplar } from '@/src/hooks/queries';
import { formatCurrency } from '@/src/utils/format';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import type { CariHesap } from '@/src/api/muhasebe';

export default function MuhasebeScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useCariHesaplar();

  const stats = useMemo(() => {
    if (!data || !data.length) return { alacak: 0, borc: 0, bakiye: 0, count: 0 };
    let alacak = 0, borc = 0, bakiye = 0;
    data.forEach((h) => {
      alacak += h.toplam_alacak || 0;
      borc += h.toplam_borc || 0;
      bakiye += h.guncel_bakiye ?? h.bakiye ?? 0;
    });
    return { alacak, borc, bakiye, count: data.length };
  }, [data]);

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.accent} />
        <Text style={styles.errorText}>Veriler yüklenemedi</Text>
        <Pressable style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />}
    >
      {/* KPI Cards */}
      <View style={styles.row}>
        <StatCard title="Toplam Alacak" value={formatCurrency(stats.alacak)} icon="arrow-down-circle-outline" color={Colors.success} />
        <View style={{ width: Spacing.sm }} />
        <StatCard title="Toplam Borç" value={formatCurrency(stats.borc)} icon="arrow-up-circle-outline" color={Colors.accent} />
      </View>
      <View style={styles.row}>
        <StatCard title="Net Bakiye" value={formatCurrency(stats.bakiye)} icon="wallet-outline" color={Colors.primary} />
        <View style={{ width: Spacing.sm }} />
        <StatCard title="Toplam Hesap" value={stats.count} icon="people-outline" />
      </View>

      {/* Cari Hesap Listesi */}
      <Text style={styles.sectionTitle}>Cari Hesaplar</Text>
      {(!data || data.length === 0) ? (
        <EmptyState icon="people-outline" message="Cari hesap bulunamadı" />
      ) : (
        data.map((hesap, i) => <CariCard key={hesap._id || hesap.id || i} hesap={hesap} />)
      )}
    </ScrollView>
  );
}

function CariCard({ hesap }: { hesap: CariHesap }) {
  const bakiye = hesap.guncel_bakiye ?? hesap.bakiye ?? 0;
  const isPositive = bakiye >= 0;
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hesapIsim} numberOfLines={1}>{hesap.isim}</Text>
          <Text style={styles.hesapKod}>{hesap.cari_kod}</Text>
        </View>
        <Text style={[styles.bakiye, { color: isPositive ? Colors.success : Colors.accent }]}>
          {formatCurrency(bakiye)}
        </Text>
      </View>
      {hesap.telefon && (
        <View style={styles.phoneRow}>
          <Ionicons name="call-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.phoneText}>{hesap.telefon}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorText: { fontSize: FontSize.md, color: Colors.textMuted, marginTop: Spacing.md },
  retryBtn: { marginTop: Spacing.md, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.primary, borderRadius: Radius.md },
  retryText: { color: Colors.white, fontWeight: '600' },
  row: { flexDirection: 'row', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  hesapIsim: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  hesapKod: { fontSize: FontSize.sm, color: Colors.textMuted },
  bakiye: { fontSize: FontSize.md, fontWeight: '700' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  phoneText: { fontSize: FontSize.xs, color: Colors.textMuted },
});
