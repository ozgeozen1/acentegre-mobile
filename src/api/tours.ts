import { api } from "./client";

export type TourListItem = {
  id: string;
  title: string;
  coverImage?: string;
  price?: number;
};

export async function getTours() {
  const res = await api.get("/tours");
  // Backend farklı format döndürüyorsa burada map edeceğiz
  return res.data as TourListItem[];
}
