import { api } from "./client";

export type BookingRequest = {
  tourId: string;
  date: string;
  personCount: number;
  totalPrice: number;
};

export type BookingResponse = {
  id: string;
  tourId: string;
  date: string;
  personCount: number;
  totalPrice: number;
  status: "pending" | "paid" | "cancelled";
};

export async function createBooking(
  booking: BookingRequest
): Promise<BookingResponse> {
  const res = await api.post("/api/web/rezervasyonlar", {
    turId: booking.tourId,
    tarih: booking.date,
    kisiSayisi: booking.personCount,
    toplamFiyat: booking.totalPrice,
  });
  const raw = res.data?.data ?? res.data;
  return {
    id: raw.id ?? `BK-${Date.now()}`,
    tourId: raw.turId ?? booking.tourId,
    date: raw.tarih ?? booking.date,
    personCount: raw.kisiSayisi ?? booking.personCount,
    totalPrice: raw.toplamFiyat ?? booking.totalPrice,
    status: raw.durum ?? "pending",
  };
}

export type PaymentRequest = {
  bookingId: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  totalPrice: number;
};

export type PaymentResponse = {
  success: boolean;
  transactionId: string;
  bookingStatus: "paid";
};

export async function processPayment(
  _payment: PaymentRequest
): Promise<PaymentResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    success: true,
    transactionId: `TXN-${Date.now()}`,
    bookingStatus: "paid",
  };
}
