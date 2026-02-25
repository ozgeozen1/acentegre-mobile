import { api } from './client';

export interface Tour {
  _id?: string;
  id?: string;
  isim: string;
  tur_kodu: string;
  yurtici_disi: string;
  aktif: boolean;
  kalkis_sehir?: string;
  gece_sayisi?: number;
  operator?: string;
  ulasim?: string[];
}

export async function getTurlar(): Promise<Tour[]> {
  const res = await api.get('/turlar');
  const data = res.data?.data || res.data;
  return Array.isArray(data) ? data : [];
}
