import { Purchase } from '../generated/prisma/client';
import { prisma } from '../prisma/client';

export interface CreatePurchaseData {
  userId: string;
  vehicleId: string;
  purchasePrice: number;
}

// Purchase with the related Vehicle included
export type PurchaseWithVehicle = Purchase & {
  vehicle: {
    id: string;
    make: string;
    model: string;
    category: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
  };
};

// Purchase with both User and Vehicle included (for Admin)
export type PurchaseWithUserAndVehicle = PurchaseWithVehicle & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

export interface IPurchaseRepository {
  create(data: CreatePurchaseData): Promise<Purchase>;
  findByUserId(userId: string): Promise<PurchaseWithVehicle[]>;
  findAll(): Promise<PurchaseWithUserAndVehicle[]>;
}

export class PurchaseRepository implements IPurchaseRepository {
  async create(data: CreatePurchaseData): Promise<Purchase> {
    return prisma.purchase.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<PurchaseWithVehicle[]> {
    return prisma.purchase.findMany({
      where: { userId },
      include: {
        vehicle: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as unknown as PurchaseWithVehicle[];
  }

  async findAll(): Promise<PurchaseWithUserAndVehicle[]> {
    return prisma.purchase.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        vehicle: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as unknown as PurchaseWithUserAndVehicle[];
  }
}
