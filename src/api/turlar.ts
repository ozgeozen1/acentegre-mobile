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
  gorsel?: string;
}

export async function getTurlar(): Promise<Tour[]> {
  // Fetch both endpoints in parallel: admin has full fields, web has gorsel
  const [adminRes, webRes] = await Promise.all([
    api.get('/turlar'),
    api.get('/web/turlar', { params: { limit: 200 } }),
  ]);

  const adminData: Tour[] = (() => {
    const d = adminRes.data?.data || adminRes.data;
    return Array.isArray(d) ? d : [];
  })();

  const webData: any[] = (() => {
    const d = webRes.data?.data || webRes.data;
    return Array.isArray(d) ? d : [];
  })();

  // Build gorsel map by tur_kodu
  const gorselMap = new Map<string, string>();
  for (const w of webData) {
    if (w.tur_kodu && w.gorsel) {
      gorselMap.set(w.tur_kodu, w.gorsel);
    }
  }

  // Merge gorsel into admin data
  return adminData.map(t => ({
    ...t,
    gorsel: gorselMap.get(t.tur_kodu) || undefined,
  }));
}
