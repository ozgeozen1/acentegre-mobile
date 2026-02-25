import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';

export default function DashboardScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>Dashboard yükleniyor...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  text: { fontSize: FontSize.md, color: Colors.textMuted },
});
