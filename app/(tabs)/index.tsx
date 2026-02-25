import { View, Text, ScrollView, RefreshControl, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/auth/AuthContext';
import { useDashboard } from '@/src/hooks/queries';
import { formatCurrency, formatDate } from '@/src/utils/format';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { data, isLoading, error, refetch, isRefetching } = useDashboard();

  if (isLoading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingCenter}>
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba,</Text>
          <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
        </View>
        <Pressable onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color={Colors.textMuted} />
        </Pressable>
      </View>

      {/* KPI Cards */}
      <View style={styles.row}>
        <StatCard title="Bugün" value={data?.bugun ?? 0} icon="today-outline" />
        <View style={{ width: Spacing.sm }} />
        <StatCard title="Bu Hafta" value={data?.bu_hafta ?? 0} icon="calendar-outline" />
      </View>
      <View style={styles.row}>
        <StatCard title="Bu Ay" value={data?.bu_ay ?? 0} icon="calendar-outline" color={Colors.primaryLight} />
        <View style={{ width: Spacing.sm }} />
        <StatCard title="Beklemede" value={data?.beklemede ?? 0} icon="time-outline" color={Colors.orange} />
      </View>
      <View style={styles.row}>
        <StatCard title="Onaylandı" value={data?.onaylandi ?? 0} icon="checkmark-circle-outline" color={Colors.success} />
        <View style={{ width: Spacing.sm }} />
        <StatCard title="Toplam Ciro" value={formatCurrency(data?.toplam_ciro)} icon="cash-outline" color={Colors.primary} />
      </View>

      {/* Son Rezervasyonlar */}
      <Text style={styles.sectionTitle}>Son Rezervasyonlar</Text>
      {(data?.son_rezervasyonlar || []).length === 0 ? (
        <Text style={styles.emptyText}>Henüz rezervasyon yok</Text>
      ) : (
        (data?.son_rezervasyonlar || []).map((rez, i) => (
          <View key={rez._id || rez.id || i} style={styles.rezCard}>
            <View style={styles.rezTop}>
              <Text style={styles.pnr}>{rez.pnr}</Text>
              <StatusBadge durum={rez.durum || rez.rezervasyon_durumu} />
            </View>
            <Text style={styles.rezMusteri} numberOfLines={1}>
              {rez.musteri ? `${rez.musteri.ad} ${rez.musteri.soyad}` : '-'}
            </Text>
            <Text style={styles.rezTur} numberOfLines={1}>{rez.tur_adi || rez.tur_ismi || '-'}</Text>
            <View style={styles.rezBottom}>
              <Text style={styles.rezDate}>
                {formatDate(rez.olusturma_tarihi || rez.created_at)}
              </Text>
              <Text style={styles.rezPrice}>
                {formatCurrency(rez.toplam_tutar || rez.fiyat?.toplam, rez.para_birimi || rez.fiyat?.para_birimi)}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: 40 },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorText: { fontSize: FontSize.md, color: Colors.textMuted, marginTop: Spacing.md },
  retryBtn: { marginTop: Spacing.md, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.primary, borderRadius: Radius.md },
  retryText: { color: Colors.white, fontWeight: '600' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  greeting: { fontSize: FontSize.sm, color: Colors.textMuted },
  userName: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  logoutBtn: { padding: Spacing.sm },
  row: { flexDirection: 'row', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.md },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', paddingVertical: 20 },
  rezCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rezTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  pnr: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  rezMusteri: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 2 },
  rezTur: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 6 },
  rezBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rezDate: { fontSize: FontSize.xs, color: Colors.textMuted },
  rezPrice: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
});
