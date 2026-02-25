import { api } from "./client";

export type TourListItem = {
  id: string;
  title: string;
  coverImage?: string;
  price?: number;
};

type TurlarResponse = {
  status: string;
  data: Array<{
    id: string;
    isim: string;
    gorsel?: string;
    fiyat?: { tutar: number };
  }>;
};

export async function getTours(): Promise<TourListItem[]> {
  const res = await api.get<TurlarResponse>("/api/web/turlar");
  const raw = res.data;
  // Debug: Metro terminalinde ne geldiğini görmek için (sonra kaldırılabilir)
  console.log("getTours raw keys:", raw ? Object.keys(raw) : "null", Array.isArray(raw) ? "array len=" + raw.length : "");
  // Backend bazen { data: [] } bazen doğrudan dizi dönebilir
  const list = Array.isArray(raw) ? raw : raw?.data ?? [];
  return list.map((item: { id: string; isim?: string; gorsel?: string; fiyat?: { tutar?: number } }) => ({
    id: item.id,
    title: item.isim ?? "",
    coverImage: item.gorsel,
    price: item.fiyat?.tutar,
  }));
}
