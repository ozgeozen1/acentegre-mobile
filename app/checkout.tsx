import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import Ionicons from "@expo/vector-icons/Ionicons";
import { processPayment } from "@/src/api/bookings";

export default function CheckoutRoute() {
  const { bookingId, totalPrice } = useLocalSearchParams<{
    bookingId: string;
    totalPrice: string;
  }>();
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paid, setPaid] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: processPayment,
    onSuccess: () => {
      setPaid(true);
    },
    onError: (err: Error) => {
      Alert.alert("Odeme Hatasi", err.message);
    },
  });

  const formatCardNumber = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePay = () => {
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length !== 16) {
      Alert.alert("Uyari", "Kart numarasi 16 haneli olmalidir.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      Alert.alert("Uyari", "Son kullanma tarihi MM/YY formatinda olmalidir.");
      return;
    }
    if (cvv.length !== 3) {
      Alert.alert("Uyari", "CVV 3 haneli olmalidir.");
      return;
    }

    mutate({
      bookingId: bookingId!,
      cardNumber: digits,
      expiry,
      cvv,
      totalPrice: Number(totalPrice),
    });
  };

  if (paid) {
    return (
      <>
        <Stack.Screen options={{ title: "Odeme Basarili" }} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <Ionicons name="checkmark-circle" size={64} color="#27ae60" />
          <Text style={{ fontSize: 22, fontWeight: "700", marginTop: 16 }}>
            Odeme Basarili!
          </Text>
          <Text
            style={{ color: "#666", marginTop: 8, textAlign: "center" }}
          >
            Rezervasyonunuz onaylandi.
          </Text>
          <Pressable
            onPress={() => router.replace("/")}
            style={{
              marginTop: 24,
              backgroundColor: "#0a7ea4",
              paddingVertical: 14,
              paddingHorizontal: 32,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              Ana Sayfaya Don
            </Text>
          </Pressable>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Odeme" }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Total */}
          <View
            style={{
              alignItems: "center",
              paddingVertical: 20,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#666", marginBottom: 4 }}>
              Odenecek Tutar
            </Text>
            <Text
              style={{ fontSize: 28, fontWeight: "700", color: "#0a7ea4" }}
            >
              {totalPrice} ₺
            </Text>
          </View>

          {/* Card form */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 12,
              padding: 16,
              gap: 14,
            }}
          >
            <Text style={{ fontWeight: "600", marginBottom: 4 }}>
              Kart Bilgileri
            </Text>

            <View>
              <Text style={{ color: "#666", marginBottom: 4, fontSize: 13 }}>
                Kart Numarasi
              </Text>
              <TextInput
                value={cardNumber}
                onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                placeholder="1234 5678 9012 3456"
                keyboardType="number-pad"
                maxLength={19}
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                }}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#666", marginBottom: 4, fontSize: 13 }}>
                  Son Kullanma
                </Text>
                <TextInput
                  value={expiry}
                  onChangeText={(t) => setExpiry(formatExpiry(t))}
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  maxLength={5}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#666", marginBottom: 4, fontSize: 13 }}>
                  CVV
                </Text>
                <TextInput
                  value={cvv}
                  onChangeText={(t) => setCvv(t.replace(/\D/g, "").slice(0, 3))}
                  placeholder="123"
                  keyboardType="number-pad"
                  maxLength={3}
                  secureTextEntry
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Pay button */}
          <Pressable
            onPress={handlePay}
            disabled={isPending}
            style={{
              backgroundColor: isPending ? "#aaa" : "#0a7ea4",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 24,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              {isPending ? "Isleniyor..." : "Odeme Yap"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
