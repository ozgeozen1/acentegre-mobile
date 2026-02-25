import { api } from './client';

export interface CariHesap {
  _id?: string;
  id?: string;
  isim: string;
  cari_kod: string;
  telefon?: string;
  eposta?: string;
  il?: string;
  aktif: boolean;
  bakiye?: number;
  toplam_borc?: number;
  toplam_alacak?: number;
  guncel_bakiye?: number;
}

export async function getCariHesaplar(): Promise<CariHesap[]> {
  const res = await api.get('/cari_hesaplar');
  const data = res.data?.data || res.data;
  return Array.isArray(data) ? data : [];
}
