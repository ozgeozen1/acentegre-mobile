import { useState } from "react";
import { View, Text, Pressable, Platform, Alert } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { createBooking } from "@/src/api/bookings";

type Props = {
  tourId: string;
  pricePerPerson: number;
};

export function BookingSection({ tourId, pricePerPerson }: Props) {
  const router = useRouter();
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [showPicker, setShowPicker] = useState(false);
  const [personCount, setPersonCount] = useState(1);

  const totalPrice = pricePerPerson * personCount;

  const { mutate, isPending } = useMutation({
    mutationFn: createBooking,
    onSuccess: (booking) => {
      router.push({
        pathname: "/checkout",
        params: {
          bookingId: booking.id,
          totalPrice: String(booking.totalPrice),
        },
      });
    },
    onError: (err: Error) => {
      Alert.alert("Hata", err.message);
    },
  });

  const handleDateChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selected) setDate(selected);
  };

  const handleBook = () => {
    mutate({
      tourId,
      date: date.toISOString().split("T")[0],
      personCount,
      totalPrice,
    });
  };

  const formattedDate = date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <View
      style={{
        marginTop: 24,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
        Rezervasyon
      </Text>

      {/* Date */}
      <Pressable
        onPress={() => setShowPicker(true)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        }}
      >
        <Text style={{ color: "#666" }}>Tarih</Text>
        <Text style={{ fontWeight: "500" }}>{formattedDate}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {/* Person count */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        }}
      >
        <Text style={{ color: "#666" }}>Kisi Sayisi</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <Pressable
            onPress={() => setPersonCount((c) => Math.max(1, c - 1))}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#ddd",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, color: "#333" }}>-</Text>
          </Pressable>
          <Text style={{ fontSize: 16, fontWeight: "600", minWidth: 20, textAlign: "center" }}>
            {personCount}
          </Text>
          <Pressable
            onPress={() => setPersonCount((c) => Math.min(10, c + 1))}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#ddd",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, color: "#333" }}>+</Text>
          </Pressable>
        </View>
      </View>

      {/* Total */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 12,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Toplam</Text>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#0a7ea4" }}>
          {totalPrice} ₺
        </Text>
      </View>

      {/* Book button */}
      <Pressable
        onPress={handleBook}
        disabled={isPending}
        style={{
          backgroundColor: isPending ? "#aaa" : "#0a7ea4",
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          {isPending ? "Gonderiliyor..." : "Rezervasyon Yap"}
        </Text>
      </Pressable>
    </View>
  );
}
