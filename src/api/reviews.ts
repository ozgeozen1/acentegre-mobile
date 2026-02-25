import { api } from "./client";

export type Review = {
  id: string;
  tourId: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
};

export type CreateReviewRequest = {
  tourId: string;
  rating: number;
  comment: string;
};

export async function getReviewsByTourId(tourId: string): Promise<Review[]> {
  const res = await api.get(`/api/web/turlar/${tourId}/yorumlar`);
  const raw = res.data;
  const list = Array.isArray(raw) ? raw : raw?.data ?? [];
  return list.map(
    (item: {
      id: string;
      turId: string;
      puan: number;
      yorum: string;
      yazarAdi?: string;
      olusturmaTarihi: string;
    }) => ({
      id: item.id,
      tourId: item.turId,
      rating: item.puan,
      comment: item.yorum,
      authorName: item.yazarAdi ?? "Anonim",
      createdAt: item.olusturmaTarihi,
    })
  );
}

export async function createReview(
  review: CreateReviewRequest
): Promise<Review> {
  const res = await api.post(`/api/web/turlar/${review.tourId}/yorumlar`, {
    puan: review.rating,
    yorum: review.comment,
  });
  const item = res.data?.data ?? res.data;
  return {
    id: item.id,
    tourId: item.turId,
    rating: item.puan,
    comment: item.yorum,
    authorName: item.yazarAdi ?? "Anonim",
    createdAt: item.olusturmaTarihi,
  };
}
