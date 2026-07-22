import { VehicleService } from '../../services/vehicle.service';
import { IVehicleRepository } from '../../repositories/vehicle.repository';

describe('VehicleService - Add & Search', () => {
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

    it('should throw an error if price is negative', async () => {
      const dto = {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: -500,
        quantity: 3,
      };

      await expect(vehicleService.addVehicle(dto)).rejects.toThrow('Price cannot be negative');
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
    it('should return search results based on query', async () => {
      const query = { make: 'Honda', minPrice: 20000 };
      mockVehicleRepository.search.mockResolvedValue([mockVehicle]);

      const result = await vehicleService.searchVehicles(query);

      expect(mockVehicleRepository.search).toHaveBeenCalledWith(query);
      expect(result).toEqual([mockVehicle]);
    });
  });
});
