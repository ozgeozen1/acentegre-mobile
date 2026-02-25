import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Radius, FontSize } from '@/constants/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}

export default function StatCard({ title, value, icon, color = '#8B1A2B' }: StatCardProps) {
  return (
    <LinearGradient
      colors={[color, color + 'CC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={18} color="#fff" />
        </View>
        <Ionicons name={icon} size={48} color="rgba(255,255,255,0.08)" style={styles.bgIcon} />
      </View>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgIcon: {
    position: 'absolute',
    right: -4,
    top: -4,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  title: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
});
