import { IVehicleRepository, VehicleSearchQuery } from '../repositories/vehicle.repository';
import { Vehicle, Purchase } from '../generated/prisma/client';
import { IPurchaseRepository } from '../repositories/purchase.repository';
import { VehicleNotFoundError } from '../errors/VehicleNotFoundError';
import { OutOfStockError } from '../errors/OutOfStockError';

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

export interface PurchaseResult {
  vehicle: Vehicle;
  purchase: Purchase;
}

export interface IVehicleService {
  addVehicle(dto: AddVehicleDto): Promise<Vehicle>;
  getAllVehicles(): Promise<Vehicle[]>;
  getVehicleById(id: string): Promise<Vehicle | null>;
  searchVehicles(query: VehicleSearchQuery): Promise<Vehicle[]>;
  updateVehicle(id: string, dto: UpdateVehicleDto): Promise<Vehicle>;
  deleteVehicle(id: string): Promise<Vehicle>;
  purchaseVehicle(vehicleId: string, userId: string): Promise<PurchaseResult>;
  restockVehicle(id: string, amount: number): Promise<Vehicle>;
}

export class VehicleService implements IVehicleService {
  constructor(
    private vehicleRepository: IVehicleRepository,
    private purchaseRepository: IPurchaseRepository,
  ) {}

  async addVehicle(dto: AddVehicleDto): Promise<Vehicle> {
    const trimmedMake = dto.make ? dto.make.trim() : '';
    if (!trimmedMake) {
      throw new Error('Make is required and cannot be empty');
    }

    const trimmedModel = dto.model ? dto.model.trim() : '';
    if (!trimmedModel) {
      throw new Error('Model is required and cannot be empty');
    }

    const trimmedCategory = dto.category ? dto.category.trim() : '';
    if (!trimmedCategory) {
      throw new Error('Category is required and cannot be empty');
    }

    if (typeof dto.price !== 'number' || Number.isNaN(dto.price) || dto.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (typeof dto.quantity !== 'number' || Number.isNaN(dto.quantity) || dto.quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    const trimmedImageUrl = dto.imageUrl && dto.imageUrl.trim() !== '' ? dto.imageUrl.trim() : null;

    return this.vehicleRepository.create({
      make: trimmedMake,
      model: trimmedModel,
      category: trimmedCategory,
      price: dto.price,
      quantity: dto.quantity,
      imageUrl: trimmedImageUrl,
    });
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll();
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findById(id);
  }

  async searchVehicles(query: VehicleSearchQuery): Promise<Vehicle[]> {
    return this.vehicleRepository.search({
      ...query,
      make: query.make?.trim(),
      model: query.model?.trim(),
      category: query.category?.trim(),
    });
  }

  async updateVehicle(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findById(id);
    if (!existingVehicle) {
      throw new VehicleNotFoundError();
    }

    if (dto.make !== undefined) {
      if (!dto.make.trim()) {
        throw new Error('Make cannot be empty');
      }
    }

    if (dto.model !== undefined) {
      if (!dto.model.trim()) {
        throw new Error('Model cannot be empty');
      }
    }

    if (dto.category !== undefined) {
      if (!dto.category.trim()) {
        throw new Error('Category cannot be empty');
      }
    }

    if (
      dto.price !== undefined &&
      (typeof dto.price !== 'number' || Number.isNaN(dto.price) || dto.price <= 0)
    ) {
      throw new Error('Price must be greater than 0');
    }

    if (
      dto.quantity !== undefined &&
      (typeof dto.quantity !== 'number' || Number.isNaN(dto.quantity) || dto.quantity < 0)
    ) {
      throw new Error('Quantity cannot be negative');
    }

    return this.vehicleRepository.update(id, {
      make: dto.make !== undefined ? dto.make.trim() : undefined,
      model: dto.model !== undefined ? dto.model.trim() : undefined,
      category: dto.category !== undefined ? dto.category.trim() : undefined,
      price: dto.price,
      quantity: dto.quantity,
      imageUrl:
        dto.imageUrl !== undefined
          ? dto.imageUrl && dto.imageUrl.trim() !== ''
            ? dto.imageUrl.trim()
            : null
          : undefined,
    });
  }

  async deleteVehicle(id: string): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findById(id);
    if (!existingVehicle) {
      throw new VehicleNotFoundError();
    }

    return this.vehicleRepository.delete(id);
  }

  async purchaseVehicle(vehicleId: string, userId: string): Promise<PurchaseResult> {
    const existingVehicle = await this.vehicleRepository.findById(vehicleId);
    if (!existingVehicle) {
      throw new VehicleNotFoundError();
    }

    if (existingVehicle.quantity <= 0) {
      throw new OutOfStockError();
    }

    const updatedVehicle = await this.vehicleRepository.update(vehicleId, {
      quantity: existingVehicle.quantity - 1,
    });

    const purchase = await this.purchaseRepository.create({
      userId,
      vehicleId,
      purchasePrice: existingVehicle.price,
    });

    return { vehicle: updatedVehicle, purchase };
  }

  async restockVehicle(id: string, amount: number): Promise<Vehicle> {
    if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
      throw new Error('Restock amount must be greater than 0');
    }

    const existingVehicle = await this.vehicleRepository.findById(id);
    if (!existingVehicle) {
      throw new VehicleNotFoundError();
    }

    return this.vehicleRepository.update(id, {
      quantity: existingVehicle.quantity + amount,
    });
  }
}
