import { View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
};

export function StarRating({
  rating,
  size = 20,
  interactive = false,
  onRate,
}: Props) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => interactive && onRate?.(star)}
          disabled={!interactive}
          hitSlop={4}
        >
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={size}
            color="#f5a623"
          />
        </Pressable>
      ))}
    </View>
  );
}
