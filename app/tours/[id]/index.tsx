import { useLocalSearchParams, Stack } from "expo-router";
import { TourDetailScreen } from "@/src/screens/TourDetailScreen";

export default function TourDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: "Tur Detayı" }} />
      <TourDetailScreen id={id!} />
    </>
  );
}
