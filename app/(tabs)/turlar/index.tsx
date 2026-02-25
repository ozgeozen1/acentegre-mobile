import { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTurlar } from '@/src/hooks/queries';
import SearchBar from '@/components/ui/SearchBar';
import EmptyState from '@/components/ui/EmptyState';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import type { Tour } from '@/src/api/turlar';

export default function TurlarScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useTurlar();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(t => t.isim?.toLowerCase().includes(q) || t.tur_kodu?.toLowerCase().includes(q));
  }, [data, search]);

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.accent} />
        <Text style={styles.errorText}>Turlar yüklenemedi</Text>
        <Pressable style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.searchWrap}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Tur ara..." />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id || item.id || item.tur_kodu}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="briefcase-outline" message="Tur bulunamadı" />}
        renderItem={({ item }) => <TourCard tour={item} />}
      />
      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => router.push('/(tabs)/turlar/ekle')}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

function TourCard({ tour }: { tour: Tour }) {
  const isYurtdisi = tour.yurtici_disi?.toLowerCase().includes('dışı') || tour.yurtici_disi?.toLowerCase().includes('disi');
  return (
    <View style={styles.card}>
      {tour.gorsel ? (
        <Image
          source={{ uri: tour.gorsel }}
          style={styles.cardImage}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.cardImagePlaceholder}>
          <Ionicons name="image-outline" size={32} color={Colors.border} />
        </View>
      )}
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.tourName} numberOfLines={2}>{tour.isim}</Text>
          <View style={[styles.aktivBadge, { backgroundColor: tour.aktif ? Colors.success + '20' : Colors.textMuted + '20' }]}>
            <Text style={[styles.aktivText, { color: tour.aktif ? Colors.success : Colors.textMuted }]}>
              {tour.aktif ? 'Aktif' : 'Pasif'}
            </Text>
          </View>
        </View>
        <Text style={styles.tourCode}>{tour.tur_kodu}</Text>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: isYurtdisi ? Colors.primaryLight + '15' : Colors.success + '15' }]}>
            <Text style={[styles.badgeText, { color: isYurtdisi ? Colors.primaryLight : Colors.success }]}>
              {isYurtdisi ? 'Yurtdışı' : 'Yurtiçi'}
            </Text>
          </View>
          {tour.gece_sayisi != null && (
            <View style={[styles.badge, { backgroundColor: Colors.primary + '15' }]}>
              <Ionicons name="moon-outline" size={12} color={Colors.primary} />
              <Text style={[styles.badgeText, { color: Colors.primary, marginLeft: 4 }]}>{tour.gece_sayisi} Gece</Text>
            </View>
          )}
        </View>
        {tour.kalkis_sehir && (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={13} color={Colors.primary} />
            <Text style={styles.locationText}>{tour.kalkis_sehir}</Text>
          </View>
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
  searchWrap: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  list: { padding: Spacing.md, paddingTop: 0 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#4a4a4a',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: Spacing.md,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  tourName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary, flex: 1, marginRight: Spacing.sm },
  tourCode: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.sm },
  badges: { flexDirection: 'row', gap: 6, marginBottom: Spacing.sm },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  badgeText: { fontSize: 11, fontWeight: '600' },
  aktivBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  aktivText: { fontSize: 11, fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.primary + '12', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full, alignSelf: 'flex-start' },
  locationText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
