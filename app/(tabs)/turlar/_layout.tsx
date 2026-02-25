import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function TurlarLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: Colors.surface }, headerTintColor: Colors.dark, headerTitleStyle: { fontWeight: '700' } }}>
      <Stack.Screen name="index" options={{ title: 'Turlar' }} />
      <Stack.Screen name="ekle" options={{ title: 'Tur Ekle', presentation: 'modal' }} />
    </Stack>
  );
}
