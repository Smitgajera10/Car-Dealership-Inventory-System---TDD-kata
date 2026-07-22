import { VehicleRepository } from '../../repositories/vehicle.repository';
import { prisma } from '../../prisma/client';

jest.mock('../../prisma/client', () => ({
  prisma: {
    vehicle: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('VehicleRepository', () => {
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    vehicleRepository = new VehicleRepository();
  });

  const mockVehicle = {
    id: 'veh-uuid-123',
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 5,
    imageUrl: 'http://example.com/camry.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('create', () => {
    it('should create and return a new vehicle', async () => {
      const createData = {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
        imageUrl: 'http://example.com/camry.jpg',
      };

      (prisma.vehicle.create as jest.Mock).mockResolvedValue(mockVehicle);

      const result = await vehicleRepository.create(createData);

      expect(prisma.vehicle.create).toHaveBeenCalledWith({ data: createData });
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('findById', () => {
    it('should return vehicle when found by id', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(mockVehicle);

      const result = await vehicleRepository.findById('veh-uuid-123');

      expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: 'veh-uuid-123' },
      });
      expect(result).toEqual(mockVehicle);
    });

    it('should return null when vehicle is not found', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await vehicleRepository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all vehicles', async () => {
      (prisma.vehicle.findMany as jest.Mock).mockResolvedValue([mockVehicle]);

      const result = await vehicleRepository.findAll();

      expect(prisma.vehicle.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('search', () => {
    it('should search vehicles with matching criteria', async () => {
      const searchQuery = {
        make: 'Toyota',
        category: 'Sedan',
        minPrice: 20000,
        maxPrice: 30000,
      };

      (prisma.vehicle.findMany as jest.Mock).mockResolvedValue([mockVehicle]);

      const result = await vehicleRepository.search(searchQuery);

      expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
        where: {
          make: { contains: 'Toyota', mode: 'insensitive' },
          category: { contains: 'Sedan', mode: 'insensitive' },
          price: { gte: 20000, lte: 30000 },
        },
      });
      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('update', () => {
    it('should update vehicle by id and return updated vehicle', async () => {
      const updateData = { price: 24000, quantity: 4 };
      const updatedVehicle = { ...mockVehicle, ...updateData };

      (prisma.vehicle.update as jest.Mock).mockResolvedValue(updatedVehicle);

      const result = await vehicleRepository.update('veh-uuid-123', updateData);

      expect(prisma.vehicle.update).toHaveBeenCalledWith({
        where: { id: 'veh-uuid-123' },
        data: updateData,
      });
      expect(result).toEqual(updatedVehicle);
    });
  });

  describe('delete', () => {
    it('should delete vehicle by id and return deleted vehicle', async () => {
      (prisma.vehicle.delete as jest.Mock).mockResolvedValue(mockVehicle);

      const result = await vehicleRepository.delete('veh-uuid-123');

      expect(prisma.vehicle.delete).toHaveBeenCalledWith({
        where: { id: 'veh-uuid-123' },
      });
      expect(result).toEqual(mockVehicle);
    });
  });
});
