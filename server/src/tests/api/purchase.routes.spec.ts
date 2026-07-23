import request from 'supertest';
import { app } from '../../app';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { generateToken } from '../../utils/jwt';

describe('Purchase API Endpoints (/api/purchases)', () => {
  const userToken = generateToken({
    id: 'user-uuid-buyer',
    email: 'buyer@example.com',
    role: 'USER',
  });

  const adminToken = generateToken({
    id: 'admin-uuid-mgr',
    email: 'admin@example.com',
    role: 'ADMIN',
  });

  const mockPurchaseWithVehicle = {
    id: 'purchase-uuid-1',
    userId: 'user-uuid-buyer',
    vehicleId: 'veh-uuid-100',
    purchasePrice: 22000,
    createdAt: new Date(),
    vehicle: {
      id: 'veh-uuid-100',
      make: 'Honda',
      model: 'Civic',
      category: 'Sedan',
      price: 22000,
      quantity: 2,
      imageUrl: null,
    },
  };

  const mockPurchaseWithUserAndVehicle = {
    ...mockPurchaseWithVehicle,
    user: {
      id: 'user-uuid-buyer',
      email: 'buyer@example.com',
      role: 'USER',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/purchases/my', () => {
    it('should return current user purchases when authenticated', async () => {
      jest
        .spyOn(PurchaseRepository.prototype, 'findByUserId')
        .mockResolvedValue([mockPurchaseWithVehicle]);

      const response = await request(app)
        .get('/api/purchases/my')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].purchasePrice).toBe(22000);
      expect(response.body.data[0].vehicle.make).toBe('Honda');
    });

    it('should return empty array when user has no purchases', async () => {
      jest
        .spyOn(PurchaseRepository.prototype, 'findByUserId')
        .mockResolvedValue([]);

      const response = await request(app)
        .get('/api/purchases/my')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return 401 Unauthorized when auth token is missing', async () => {
      const response = await request(app).get('/api/purchases/my');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/purchases', () => {
    it('should return all purchases when user has ADMIN role', async () => {
      jest
        .spyOn(PurchaseRepository.prototype, 'findAll')
        .mockResolvedValue([mockPurchaseWithUserAndVehicle]);

      const response = await request(app)
        .get('/api/purchases')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].user.email).toBe('buyer@example.com');
      expect(response.body.data[0].vehicle.make).toBe('Honda');
      expect(response.body.data[0].purchasePrice).toBe(22000);
    });

    it('should return 403 Forbidden when non-admin user attempts to list all purchases', async () => {
      const response = await request(app)
        .get('/api/purchases')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 Unauthorized when auth token is missing', async () => {
      const response = await request(app).get('/api/purchases');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
