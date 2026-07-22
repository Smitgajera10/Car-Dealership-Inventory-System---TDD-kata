import { VehicleService } from '../../services/vehicle.service';
import { IVehicleRepository } from '../../repositories/vehicle.repository';
import { VehicleNotFoundError } from '../../errors/VehicleNotFoundError';
import { OutOfStockError } from '../../errors/OutOfStockError';

describe('VehicleService', () => {
  let vehicleService: VehicleService;
  let mockVehicleRepository: jest.Mocked<IVehicleRepository>;

  const mockVehicle = {
    id: 'veh-uuid-1',
    make: 'Honda',
    model: 'Civic',
    category: 'Sedan',
    price: 22000,
    quantity: 3,
    imageUrl: 'http://example.com/civic.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockVehicleRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      search: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    vehicleService = new VehicleService(mockVehicleRepository);
  });

  describe('addVehicle', () => {
    it('should successfully add a new vehicle', async () => {
      const dto = {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 3,
        imageUrl: 'http://example.com/civic.jpg',
      };

      mockVehicleRepository.create.mockResolvedValue(mockVehicle);

      const result = await vehicleService.addVehicle(dto);

      expect(mockVehicleRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockVehicle);
    });

    it('should reject empty make', async () => {
      const dto = {
        make: '   ',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 3,
      };

      await expect(vehicleService.addVehicle(dto)).rejects.toThrow('Make is required');
      expect(mockVehicleRepository.create).not.toHaveBeenCalled();
    });

    it('should reject empty model', async () => {
      const dto = {
        make: 'Honda',
        model: '   ',
        category: 'Sedan',
        price: 22000,
        quantity: 3,
      };

      await expect(vehicleService.addVehicle(dto)).rejects.toThrow('Model is required');
      expect(mockVehicleRepository.create).not.toHaveBeenCalled();
    });

    it('should reject empty category', async () => {
      const dto = {
        make: 'Honda',
        model: 'Civic',
        category: '   ',
        price: 22000,
        quantity: 3,
      };

      await expect(vehicleService.addVehicle(dto)).rejects.toThrow('Category is required');
      expect(mockVehicleRepository.create).not.toHaveBeenCalled();
    });

    it('should trim make, model, and category', async () => {
      const dto = {
        make: '  Honda  ',
        model: '  Civic  ',
        category: '  Sedan  ',
        price: 22000,
        quantity: 3,
      };

      mockVehicleRepository.create.mockResolvedValue({
        ...mockVehicle,
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        imageUrl: null,
      });

      await vehicleService.addVehicle(dto);

      expect(mockVehicleRepository.create).toHaveBeenCalledWith({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 3,
        imageUrl: null,
      });
    });

    it('should trim imageUrl when provided', async () => {
      const dto = {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 3,
        imageUrl: '  http://example.com/civic.jpg  ',
      };

      mockVehicleRepository.create.mockResolvedValue(mockVehicle);

      await vehicleService.addVehicle(dto);

      expect(mockVehicleRepository.create).toHaveBeenCalledWith({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 3,
        imageUrl: 'http://example.com/civic.jpg',
      });
    });

    it('should convert undefined or empty string imageUrl to null', async () => {
      const dto = {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 3,
      };

      mockVehicleRepository.create.mockResolvedValue({ ...mockVehicle, imageUrl: null });

      await vehicleService.addVehicle(dto);

      expect(mockVehicleRepository.create).toHaveBeenCalledWith({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 3,
        imageUrl: null,
      });
    });

    it('should allow quantity = 0 to succeed', async () => {
      const dto = {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 0,
      };

      mockVehicleRepository.create.mockResolvedValue({ ...mockVehicle, quantity: 0 });

      const result = await vehicleService.addVehicle(dto);

      expect(mockVehicleRepository.create).toHaveBeenCalledWith({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 0,
        imageUrl: null,
      });
      expect(result.quantity).toBe(0);
    });

    it('should reject price = 0 as price must be greater than 0', async () => {
      const dto = {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 0,
        quantity: 3,
      };

      await expect(vehicleService.addVehicle(dto)).rejects.toThrow('Price must be greater than 0');
      expect(mockVehicleRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if price is negative', async () => {
      const dto = {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: -500,
        quantity: 3,
      };

      await expect(vehicleService.addVehicle(dto)).rejects.toThrow('Price must be greater than 0');
      expect(mockVehicleRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if price is NaN', async () => {
      const dto = {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: NaN,
        quantity: 3,
      };

      await expect(vehicleService.addVehicle(dto)).rejects.toThrow('Price must be greater than 0');
      expect(mockVehicleRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if quantity is negative', async () => {
      const dto = {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: -1,
      };

      await expect(vehicleService.addVehicle(dto)).rejects.toThrow('Quantity cannot be negative');
      expect(mockVehicleRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllVehicles', () => {
    it('should return all vehicles from repository', async () => {
      mockVehicleRepository.findAll.mockResolvedValue([mockVehicle]);

      const result = await vehicleService.getAllVehicles();

      expect(mockVehicleRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('getVehicleById', () => {
    it('should return vehicle by id when found', async () => {
      mockVehicleRepository.findById.mockResolvedValue(mockVehicle);

      const result = await vehicleService.getVehicleById('veh-uuid-1');

      expect(mockVehicleRepository.findById).toHaveBeenCalledWith('veh-uuid-1');
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('searchVehicles', () => {
    it('should return search results based on query and trim query string values', async () => {
      const query = { make: '  Honda  ', model: '  Civic  ', category: '  Sedan  ', minPrice: 20000 };
      mockVehicleRepository.search.mockResolvedValue([mockVehicle]);

      const result = await vehicleService.searchVehicles(query);

      expect(mockVehicleRepository.search).toHaveBeenCalledWith({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        minPrice: 20000,
      });
      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('updateVehicle', () => {
    it('should update vehicle details successfully and trim input values', async () => {
      const updateDto = {
        make: '  Honda  ',
        model: '  Accord  ',
        category: '  Sedan  ',
        imageUrl: '  http://example.com/accord.jpg  ',
        price: 24000,
        quantity: 0,
      };

      const updatedVehicle = { ...mockVehicle, price: 24000, quantity: 0, make: 'Honda', model: 'Accord' };

      mockVehicleRepository.findById.mockResolvedValue(mockVehicle);
      mockVehicleRepository.update.mockResolvedValue(updatedVehicle);

      const result = await vehicleService.updateVehicle('veh-uuid-1', updateDto);

      expect(mockVehicleRepository.findById).toHaveBeenCalledWith('veh-uuid-1');
      expect(mockVehicleRepository.update).toHaveBeenCalledWith('veh-uuid-1', {
        make: 'Honda',
        model: 'Accord',
        category: 'Sedan',
        price: 24000,
        quantity: 0,
        imageUrl: 'http://example.com/accord.jpg',
      });
      expect(result).toEqual(updatedVehicle);
    });

    it('should reject empty make during update', async () => {
      mockVehicleRepository.findById.mockResolvedValue(mockVehicle);

      await expect(
        vehicleService.updateVehicle('veh-uuid-1', { make: '   ' })
      ).rejects.toThrow('Make cannot be empty');
      expect(mockVehicleRepository.update).not.toHaveBeenCalled();
    });

    it('should reject empty model during update', async () => {
      mockVehicleRepository.findById.mockResolvedValue(mockVehicle);

      await expect(
        vehicleService.updateVehicle('veh-uuid-1', { model: '   ' })
      ).rejects.toThrow('Model cannot be empty');
      expect(mockVehicleRepository.update).not.toHaveBeenCalled();
    });

    it('should reject empty category during update', async () => {
      mockVehicleRepository.findById.mockResolvedValue(mockVehicle);

      await expect(
        vehicleService.updateVehicle('veh-uuid-1', { category: '   ' })
      ).rejects.toThrow('Category cannot be empty');
      expect(mockVehicleRepository.update).not.toHaveBeenCalled();
    });

    it('should throw VehicleNotFoundError when vehicle is not found for update', async () => {
      mockVehicleRepository.findById.mockResolvedValue(null);

      await expect(
        vehicleService.updateVehicle('invalid-id', { price: 24000 })
      ).rejects.toThrow(VehicleNotFoundError);
      expect(mockVehicleRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if updated price is 0 or negative', async () => {
      mockVehicleRepository.findById.mockResolvedValue(mockVehicle);

      await expect(
        vehicleService.updateVehicle('veh-uuid-1', { price: 0 })
      ).rejects.toThrow('Price must be greater than 0');
      expect(mockVehicleRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if updated quantity is negative', async () => {
      mockVehicleRepository.findById.mockResolvedValue(mockVehicle);

      await expect(
        vehicleService.updateVehicle('veh-uuid-1', { quantity: -5 })
      ).rejects.toThrow('Quantity cannot be negative');
      expect(mockVehicleRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteVehicle', () => {
    it('should delete vehicle when it exists', async () => {
      mockVehicleRepository.findById.mockResolvedValue(mockVehicle);
      mockVehicleRepository.delete.mockResolvedValue(mockVehicle);

      const result = await vehicleService.deleteVehicle('veh-uuid-1');

      expect(mockVehicleRepository.findById).toHaveBeenCalledWith('veh-uuid-1');
      expect(mockVehicleRepository.delete).toHaveBeenCalledWith('veh-uuid-1');
      expect(result).toEqual(mockVehicle);
    });

    it('should throw VehicleNotFoundError when trying to delete non-existent vehicle', async () => {
      mockVehicleRepository.findById.mockResolvedValue(null);

      await expect(vehicleService.deleteVehicle('invalid-id')).rejects.toThrow(VehicleNotFoundError);
      expect(mockVehicleRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('purchaseVehicle', () => {
    it('should decrement vehicle quantity by 1 when stock is available', async () => {
      const existingVehicle = { ...mockVehicle, quantity: 3 };
      const purchasedVehicle = { ...mockVehicle, quantity: 2 };

      mockVehicleRepository.findById.mockResolvedValue(existingVehicle);
      mockVehicleRepository.update.mockResolvedValue(purchasedVehicle);

      const result = await vehicleService.purchaseVehicle('veh-uuid-1');

      expect(mockVehicleRepository.findById).toHaveBeenCalledWith('veh-uuid-1');
      expect(mockVehicleRepository.update).toHaveBeenCalledWith('veh-uuid-1', {
        quantity: 2,
      });
      expect(result).toEqual(purchasedVehicle);
    });

    it('should throw OutOfStockError when vehicle quantity is 0', async () => {
      const outOfStockVehicle = { ...mockVehicle, quantity: 0 };
      mockVehicleRepository.findById.mockResolvedValue(outOfStockVehicle);

      await expect(vehicleService.purchaseVehicle('veh-uuid-1')).rejects.toThrow(
        OutOfStockError
      );
      expect(mockVehicleRepository.update).not.toHaveBeenCalled();
    });

    it('should throw VehicleNotFoundError when vehicle is not found for purchase', async () => {
      mockVehicleRepository.findById.mockResolvedValue(null);

      await expect(vehicleService.purchaseVehicle('invalid-id')).rejects.toThrow(
        VehicleNotFoundError
      );
      expect(mockVehicleRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('restockVehicle', () => {
    it('should increment vehicle quantity by restock amount', async () => {
      const existingVehicle = { ...mockVehicle, quantity: 2 };
      const restockedVehicle = { ...mockVehicle, quantity: 7 };

      mockVehicleRepository.findById.mockResolvedValue(existingVehicle);
      mockVehicleRepository.update.mockResolvedValue(restockedVehicle);

      const result = await vehicleService.restockVehicle('veh-uuid-1', 5);

      expect(mockVehicleRepository.findById).toHaveBeenCalledWith('veh-uuid-1');
      expect(mockVehicleRepository.update).toHaveBeenCalledWith('veh-uuid-1', {
        quantity: 7,
      });
      expect(result).toEqual(restockedVehicle);
    });

    it('should throw an error when restock amount is 0', async () => {
      mockVehicleRepository.findById.mockResolvedValue(mockVehicle);

      await expect(vehicleService.restockVehicle('veh-uuid-1', 0)).rejects.toThrow(
        'Restock amount must be greater than 0'
      );
      expect(mockVehicleRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error when restock amount is negative (e.g. -5)', async () => {
      mockVehicleRepository.findById.mockResolvedValue(mockVehicle);

      await expect(vehicleService.restockVehicle('veh-uuid-1', -5)).rejects.toThrow(
        'Restock amount must be greater than 0'
      );
      expect(mockVehicleRepository.update).not.toHaveBeenCalled();
    });

    it('should throw VehicleNotFoundError when vehicle is not found for restock', async () => {
      mockVehicleRepository.findById.mockResolvedValue(null);

      await expect(vehicleService.restockVehicle('invalid-id', 5)).rejects.toThrow(
        VehicleNotFoundError
      );
      expect(mockVehicleRepository.update).not.toHaveBeenCalled();
    });
  });
});
