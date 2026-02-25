import { View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getReviewsByTourId } from "@/src/api/reviews";
import { StarRating } from "./StarRating";

type Props = { tourId: string };

export function ReviewList({ tourId }: Props) {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", tourId],
    queryFn: () => getReviewsByTourId(tourId),
  });

  if (isLoading) {
    return <Text style={{ color: "#999" }}>Yorumlar yukleniyor...</Text>;
  }

  if (reviews.length === 0) {
    return <Text style={{ color: "#999" }}>Henuz yorum yok.</Text>;
  }

  return (
    <View style={{ gap: 12 }}>
      {reviews.map((review) => (
        <View
          key={review.id}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontWeight: "600" }}>{review.authorName}</Text>
            <StarRating rating={review.rating} size={14} />
          </View>
          <Text style={{ color: "#333", lineHeight: 20 }}>
            {review.comment}
          </Text>
        </View>
      ))}
    </View>
  );
}
