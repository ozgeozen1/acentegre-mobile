import { api } from './client';

export interface CreateTourData {
  isim: string;
  tur_kodu?: string;
  yurtici_disi: string;
  gece_sayisi: number;
  kalkis_sehir: string;
  aciklama?: string;
  operator?: string;
  aktif: boolean;
  b2c_yayinla: boolean;
  b2b_yayinla: boolean;
  ulasim_tipi?: string;
  konaklama?: string;
  baslangic_fiyati_tl?: number;
  liste_resmi?: string;
  gunubirlik?: boolean;
}

export async function createTour(data: CreateTourData) {
  const res = await api.post('/asil_tur_detayi', data);
  return res.data;
}
