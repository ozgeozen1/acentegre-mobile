import { useQuery } from '@tanstack/react-query';
import { getDashboardOzet } from '@/src/api/dashboard';
import { getTurlar } from '@/src/api/turlar';
import { getReservations } from '@/src/api/operasyon';
import { getCariHesaplar } from '@/src/api/muhasebe';

export function useDashboard() {
  return useQuery({ queryKey: ['dashboard'], queryFn: getDashboardOzet });
}

export function useTurlar() {
  return useQuery({ queryKey: ['turlar'], queryFn: getTurlar });
}

export function useReservations(durum?: string) {
  return useQuery({
    queryKey: ['reservations', durum],
    queryFn: () => getReservations(durum ? { durum } : undefined),
  });
}

export function useCariHesaplar() {
  return useQuery({ queryKey: ['cari-hesaplar'], queryFn: getCariHesaplar });
}
