import api from '../lib/api';
import type {
  AuthResponse,
  VehicleListResponse,
  VehicleResponse,
  VehicleSearchParams,
  AddVehiclePayload,
  UpdateVehiclePayload,
} from '../types';

// ── Auth ────────────────────────────────────────────
export const authApi = {
  register: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
};

// ── Vehicles ────────────────────────────────────────
export const vehicleApi = {
  getAll: () => api.get<VehicleListResponse>('/vehicles'),

  getById: (id: string) => api.get<VehicleResponse>(`/vehicles/${id}`),

  search: (params: VehicleSearchParams) =>
    api.get<VehicleListResponse>('/vehicles/search', { params }),

  add: (payload: AddVehiclePayload) =>
    api.post<VehicleResponse>('/vehicles', payload),

  update: (id: string, payload: UpdateVehiclePayload) =>
    api.put<VehicleResponse>(`/vehicles/${id}`, payload),

  delete: (id: string) => api.delete<VehicleResponse>(`/vehicles/${id}`),

  purchase: (id: string) =>
    api.post<VehicleResponse>(`/vehicles/${id}/purchase`),

  restock: (id: string, amount: number) =>
    api.post<VehicleResponse>(`/vehicles/${id}/restock`, { amount }),
};
