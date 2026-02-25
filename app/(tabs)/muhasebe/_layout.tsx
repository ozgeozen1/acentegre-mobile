import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function MuhasebeLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: Colors.surface }, headerTintColor: Colors.dark, headerTitleStyle: { fontWeight: '700' } }}>
      <Stack.Screen name="index" options={{ title: 'Muhasebe' }} />
    </Stack>
  );
}
