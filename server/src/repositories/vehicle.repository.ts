import { Vehicle, Prisma } from '../generated/prisma/client';
import { prisma } from '../prisma/client';

export interface CreateVehicleData {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

export interface UpdateVehicleData {
  make?: string;
  model?: string;
  category?: string;
  price?: number;
  quantity?: number;
  imageUrl?: string | null;
}

export interface VehicleSearchQuery {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface IVehicleRepository {
  create(data: CreateVehicleData): Promise<Vehicle>;
  findById(id: string): Promise<Vehicle | null>;
  findAll(): Promise<Vehicle[]>;
  search(query: VehicleSearchQuery): Promise<Vehicle[]>;
  update(id: string, data: UpdateVehicleData): Promise<Vehicle>;
  delete(id: string): Promise<Vehicle>;
}

export class VehicleRepository implements IVehicleRepository {
  async create(data: CreateVehicleData): Promise<Vehicle> {
    return prisma.vehicle.create({
      data,
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Vehicle[]> {
    return prisma.vehicle.findMany();
  }

  async search(query: VehicleSearchQuery): Promise<Vehicle[]> {
    const where: Prisma.VehicleWhereInput = {};

    if (query.make) {
      where.make = { contains: query.make, mode: 'insensitive' };
    }

    if (query.model) {
      where.model = { contains: query.model, mode: 'insensitive' };
    }

    if (query.category) {
      where.category = { contains: query.category, mode: 'insensitive' };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }

    return prisma.vehicle.findMany({
      where,
    });
  }

  async update(id: string, data: UpdateVehicleData): Promise<Vehicle> {
    return prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Vehicle> {
    return prisma.vehicle.delete({
      where: { id },
    });
  }
}
