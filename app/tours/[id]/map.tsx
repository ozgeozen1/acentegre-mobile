import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import { getTourById } from "@/src/api/tours";

export default function TourMapRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: tour, isLoading } = useQuery({
    queryKey: ["tours", id],
    queryFn: () => getTourById(id!),
  });

  if (isLoading || !tour) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!tour.latitude || !tour.longitude) {
    return (
      <>
        <Stack.Screen options={{ title: "Harita" }} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Konum bilgisi bulunamadi.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: tour.title }} />
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: tour.latitude,
          longitude: tour.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{
            latitude: tour.latitude,
            longitude: tour.longitude,
          }}
          title={tour.title}
        />
      </MapView>
    </>
  );
}
