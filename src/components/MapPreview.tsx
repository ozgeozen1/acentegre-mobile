import { View, Text, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";

type Props = {
  tourId: string;
  tourTitle: string;
  latitude: number;
  longitude: number;
};

export function MapPreview({ tourId, tourTitle, latitude, longitude }: Props) {
  const router = useRouter();

  return (
    <View style={{ marginTop: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
        Konum
      </Text>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/tours/[id]/map",
            params: { id: tourId },
          })
        }
      >
        <View style={{ borderRadius: 12, overflow: "hidden" }}>
          <MapView
            style={{ height: 180 }}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker
              coordinate={{ latitude, longitude }}
              title={tourTitle}
            />
          </MapView>
        </View>
      </Pressable>
    </View>
  );
}
