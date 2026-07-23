export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleListResponse {
  success: boolean;
  data: Vehicle[];
}

export interface VehicleResponse {
  success: boolean;
  data: Vehicle;
}

export interface ApiError {
  success: false;
  message: string;
}

export interface VehicleSearchParams {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface AddVehiclePayload {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

export interface UpdateVehiclePayload {
  make?: string;
  model?: string;
  category?: string;
  price?: number;
  quantity?: number;
  imageUrl?: string | null;
}
