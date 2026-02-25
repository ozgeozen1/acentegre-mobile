import { api } from './client';

export interface LoginResponse {
  status: string;
  access_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    rol?: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}
