import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';

export default function OperasyonScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>Operasyon yükleniyor...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  text: { fontSize: FontSize.md, color: Colors.textMuted },
});
