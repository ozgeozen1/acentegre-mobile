import { api } from './client';

export interface Rezervasyon {
  _id?: string;
  id?: string;
  pnr: string;
  tur_adi?: string;
  tur_ismi?: string;
  tur_kodu?: string;
  cikis_tarihi?: string;
  musteri?: { ad: string; soyad: string; telefon?: string };
  durum?: string;
  rezervasyon_durumu?: string;
  toplam_tutar?: number;
  fiyat?: { toplam: number; para_birimi?: string };
  para_birimi?: string;
  olusturma_tarihi?: string;
  created_at?: string;
  yolcu_sayisi?: { yetiskin: number; cocuk: number; bebek: number; toplam: number };
}

interface GetReservationsParams {
  durum?: string;
  limit?: number;
  sayfa?: number;
}

export async function getReservations(params?: GetReservationsParams): Promise<Rezervasyon[]> {
  const res = await api.get('/panel/rezervasyonlar', { params: { limit: 50, ...params } });
  const data = res.data?.data;
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  return [];
}
