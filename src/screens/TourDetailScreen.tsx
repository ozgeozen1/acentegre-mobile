import { useQuery } from "@tanstack/react-query";
import { Text, View, ScrollView, Image } from "react-native";
import { getTourById } from "../api/tours";
import { FavoriteButton } from "../components/FavoriteButton";
import { BookingSection } from "../components/BookingSection";
import { ReviewList } from "../components/ReviewList";
import { ReviewForm } from "../components/ReviewForm";
import { MapPreview } from "../components/MapPreview";

export function TourDetailScreen({ id }: { id: string }) {
  const { data: tour, isLoading, error } = useQuery({
    queryKey: ["tours", id],
    queryFn: () => getTourById(id),
  });

  if (isLoading) return <Center text="Yükleniyor..." />;
  if (error) return <Center text={(error as Error).message} />;
  if (!tour) return <Center text="Tur bulunamadı." />;

  return (
    <ScrollView style={{ flex: 1 }}>
      {!!tour.coverImage && (
        <Image
          source={{ uri: tour.coverImage }}
          style={{ width: "100%", height: 250 }}
          resizeMode="cover"
        />
      )}
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: "700", flex: 1, marginRight: 12 }}>
            {tour.title}
          </Text>
          <FavoriteButton tourId={id} size={28} />
        </View>
        {!!tour.price && (
          <Text style={{ fontSize: 18, color: "#0a7ea4", marginBottom: 12 }}>
            {tour.price} ₺
          </Text>
        )}
        {!!tour.description && (
          <Text style={{ fontSize: 16, lineHeight: 24, color: "#333" }}>
            {tour.description}
          </Text>
        )}

        {/* Map */}
        {!!tour.latitude && !!tour.longitude && (
          <MapPreview
            tourId={id}
            tourTitle={tour.title}
            latitude={tour.latitude}
            longitude={tour.longitude}
          />
        )}

        {/* Reviews */}
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
            Yorumlar
          </Text>
          <ReviewList tourId={id} />
          <ReviewForm tourId={id} />
        </View>

        {!!tour.price && (
          <BookingSection tourId={id} pricePerPerson={tour.price} />
        )}
      </View>
    </ScrollView>
  );
}

function Center({ text }: { text: string }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{text}</Text>
    </View>
  );
}
