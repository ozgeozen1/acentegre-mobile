import { useQuery } from "@tanstack/react-query";
import { FlatList, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { getTours } from "../api/tours";
import { FavoriteButton } from "../components/FavoriteButton";

export function ToursListScreen() {
  console.log("BASE URL:", process.env.EXPO_PUBLIC_API_BASE_URL);

  const { data, isLoading, error } = useQuery({
    queryKey: ["tours"],
    queryFn: getTours,
  });

  if (isLoading) return <Center text="Yükleniyor..." />;
  if (error) return <Center text={(error as Error).message} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 12 }}>
        Turlar
      </Text>

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <Text style={{ color: "#666" }}>Henüz tur yok.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={`/tours/${item.id}`} asChild>
            <Pressable
              style={{
                padding: 12,
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 12,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  {item.title}
                </Text>
                {!!item.price && <Text>{item.price} ₺</Text>}
              </View>
              <FavoriteButton tourId={item.id} />
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

function Center({ text }: { text: string }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{text}</Text>
    </View>
  );
}
