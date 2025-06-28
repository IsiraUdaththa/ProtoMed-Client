// utils/fetcher.ts
import api from '@/lib/axiosInstance';

export const fetcher = (url: string) =>
  api.get(url).then(res => res.data);
