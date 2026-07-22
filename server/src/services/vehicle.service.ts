import { IVehicleRepository, CreateVehicleData, UpdateVehicleData, VehicleSearchQuery } from '../repositories/vehicle.repository';
import { Vehicle } from '../generated/prisma/client';

export interface AddVehicleDto {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

export interface UpdateVehicleDto {
  make?: string;
  model?: string;
  category?: string;
  price?: number;
  quantity?: number;
  imageUrl?: string | null;
}

export interface IVehicleService {
  addVehicle(dto: AddVehicleDto): Promise<Vehicle>;
  getAllVehicles(): Promise<Vehicle[]>;
  getVehicleById(id: string): Promise<Vehicle | null>;
  searchVehicles(query: VehicleSearchQuery): Promise<Vehicle[]>;
  updateVehicle(id: string, dto: UpdateVehicleDto): Promise<Vehicle>;
  deleteVehicle(id: string): Promise<Vehicle>;
}

export class VehicleService implements IVehicleService {
  constructor(private vehicleRepository: IVehicleRepository) {}

  async addVehicle(dto: AddVehicleDto): Promise<Vehicle> {
    if (dto.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (dto.quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    return this.vehicleRepository.create({
      make: dto.make.trim(),
      model: dto.model.trim(),
      category: dto.category.trim(),
      price: dto.price,
      quantity: dto.quantity,
      imageUrl: dto.imageUrl ? dto.imageUrl.trim() : null,
    });
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll();
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findById(id);
  }

  async searchVehicles(query: VehicleSearchQuery): Promise<Vehicle[]> {
    return this.vehicleRepository.search(query);
  }

  async updateVehicle(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findById(id);
    if (!existingVehicle) {
      throw new Error('Vehicle not found');
    }

    if (dto.price !== undefined && dto.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (dto.quantity !== undefined && dto.quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    return this.vehicleRepository.update(id, dto);
  }

  async deleteVehicle(id: string): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findById(id);
    if (!existingVehicle) {
      throw new Error('Vehicle not found');
    }

    return this.vehicleRepository.delete(id);
  }
}
