import { Pressable, GestureResponderEvent } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFavorites } from "@/src/store/favorites";

type Props = {
  tourId: string;
  size?: number;
};

export function FavoriteButton({ tourId, size = 24 }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const filled = isFavorite(tourId);

  const handlePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    toggleFavorite(tourId);
  };

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Ionicons
        name={filled ? "heart" : "heart-outline"}
        size={size}
        color={filled ? "#e74c3c" : "#999"}
      />
    </Pressable>
  );
}
