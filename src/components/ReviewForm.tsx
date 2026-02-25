import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "@/src/api/reviews";
import { StarRating } from "./StarRating";

type Props = { tourId: string };

export function ReviewForm({ tourId }: Props) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", tourId] });
      setRating(0);
      setComment("");
      Alert.alert("Basarili", "Yorumunuz eklendi.");
    },
    onError: (err: Error) => {
      Alert.alert("Hata", err.message);
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert("Uyari", "Lutfen bir puan secin.");
      return;
    }
    mutate({ tourId, rating, comment });
  };

  return (
    <View
      style={{
        marginTop: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <Text style={{ fontWeight: "600", marginBottom: 8 }}>Yorum Ekle</Text>

      <StarRating rating={rating} size={28} interactive onRate={setRating} />

      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Yorumunuzu yazin..."
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          padding: 10,
          marginTop: 10,
          minHeight: 80,
          fontSize: 14,
        }}
      />

      <Pressable
        onPress={handleSubmit}
        disabled={isPending}
        style={{
          backgroundColor: isPending ? "#aaa" : "#0a7ea4",
          paddingVertical: 10,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {isPending ? "Gonderiliyor..." : "Yorum Ekle"}
        </Text>
      </Pressable>
    </View>
  );
}
