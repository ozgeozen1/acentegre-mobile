import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "favorites";

async function getFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function setFavorites(ids: string[]): Promise<string[]> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  return ids;
}

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: Infinity,
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async (tourId: string) => {
      const current = await getFavorites();
      const next = current.includes(tourId)
        ? current.filter((id) => id !== tourId)
        : [...current, tourId];
      return setFavorites(next);
    },
    onSuccess: (newFavorites) => {
      queryClient.setQueryData(["favorites"], newFavorites);
    },
  });

  const isFavorite = (tourId: string) => favorites.includes(tourId);

  return { favorites, toggleFavorite, isFavorite };
}
