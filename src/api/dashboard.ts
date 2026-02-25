import { api } from './client';

export interface DashboardOzet {
  bugun: number;
  bu_hafta: number;
  bu_ay: number;
  on_kayit: number;
  beklemede: number;
  onaylandi: number;
  toplam_ciro: number;
  son_rezervasyonlar: Array<{
    _id?: string;
    id?: string;
    pnr: string;
    musteri?: { ad: string; soyad: string };
    tur_adi?: string;
    tur_ismi?: string;
    olusturma_tarihi?: string;
    created_at?: string;
    durum?: string;
    rezervasyon_durumu?: string;
    toplam_tutar?: number;
    fiyat?: { toplam: number; para_birimi?: string };
    para_birimi?: string;
  }>;
}

export async function getDashboardOzet(): Promise<DashboardOzet> {
  const res = await api.get('/panel/rezervasyonlar/ozet');
  return res.data?.data || res.data || {};
}
