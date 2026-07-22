import request from 'supertest';
import { app } from '../../app';
import { VehicleService } from '../../services/vehicle.service';
import { generateToken } from '../../utils/jwt';
import { VehicleNotFoundError } from '../../errors/VehicleNotFoundError';
import { OutOfStockError } from '../../errors/OutOfStockError';
import { Vehicle } from '../../generated/prisma/client';

describe('Vehicle API Endpoints (/api/vehicles)', () => {
  const userToken = generateToken({
    id: 'user-uuid-123',
    email: 'user@example.com',
    role: 'USER',
  });

  const adminToken = generateToken({
    id: 'admin-uuid-123',
    email: 'admin@example.com',
    role: 'ADMIN',
  });

  const mockVehicle: Vehicle = {
    id: 'veh-uuid-100',
    make: 'Toyota',
    model: 'Corolla',
    category: 'Sedan',
    price: 20000,
    quantity: 10,
    imageUrl: 'http://example.com/corolla.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const serializedVehicle = {
    ...mockVehicle,
    createdAt: mockVehicle.createdAt.toISOString(),
    updatedAt: mockVehicle.updatedAt.toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/vehicles', () => {
    it('should create a vehicle when authenticated and data is valid', async () => {
      jest
        .spyOn(VehicleService.prototype, 'addVehicle')
        .mockResolvedValue(mockVehicle);

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: 20000,
          quantity: 10,
          imageUrl: 'http://example.com/corolla.jpg',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        data: serializedVehicle,
      });
    });

    it('should return 401 Unauthorized when authorization token is missing', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .send({
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: 20000,
          quantity: 10,
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/vehicles', () => {
    it('should return list of all vehicles', async () => {
      jest
        .spyOn(VehicleService.prototype, 'getAllVehicles')
        .mockResolvedValue([mockVehicle]);

      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: [serializedVehicle],
      });
    });
  });

  describe('GET /api/vehicles/search', () => {
    it('should return search results for matching criteria', async () => {
      jest
        .spyOn(VehicleService.prototype, 'searchVehicles')
        .mockResolvedValue([mockVehicle]);

      const response = await request(app)
        .get('/api/vehicles/search')
        .query({ make: 'Toyota', category: 'Sedan' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: [serializedVehicle],
      });
    });
  });

  describe('GET /api/vehicles/:id', () => {
    it('should return vehicle details by id', async () => {
      jest
        .spyOn(VehicleService.prototype, 'getVehicleById')
        .mockResolvedValue(mockVehicle);

      const response = await request(app).get('/api/vehicles/veh-uuid-100');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: serializedVehicle,
      });
    });

    it('should return 404 Not Found when vehicle does not exist', async () => {
      jest
        .spyOn(VehicleService.prototype, 'getVehicleById')
        .mockResolvedValue(null);

      const response = await request(app).get('/api/vehicles/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Vehicle not found',
      });
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should update vehicle when authenticated user sends update payload', async () => {
      const updatedVehicle = { ...mockVehicle, price: 21000 };
      const serializedUpdated = {
        ...updatedVehicle,
        createdAt: updatedVehicle.createdAt.toISOString(),
        updatedAt: updatedVehicle.updatedAt.toISOString(),
      };

      jest
        .spyOn(VehicleService.prototype, 'updateVehicle')
        .mockResolvedValue(updatedVehicle);

      const response = await request(app)
        .put('/api/vehicles/veh-uuid-100')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 21000 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: serializedUpdated,
      });
    });

    it('should return 404 Not Found when updating non-existent vehicle', async () => {
      jest
        .spyOn(VehicleService.prototype, 'updateVehicle')
        .mockRejectedValue(new VehicleNotFoundError());

      const response = await request(app)
        .put('/api/vehicles/non-existent-id')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 21000 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Vehicle not found',
      });
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should delete vehicle when user has ADMIN role', async () => {
      jest
        .spyOn(VehicleService.prototype, 'deleteVehicle')
        .mockResolvedValue(mockVehicle);

      const response = await request(app)
        .delete('/api/vehicles/veh-uuid-100')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: serializedVehicle,
      });
    });

    it('should return 403 Forbidden when non-admin user attempts deletion', async () => {
      const response = await request(app)
        .delete('/api/vehicles/veh-uuid-100')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 Not Found when admin attempts deleting non-existent vehicle', async () => {
      jest
        .spyOn(VehicleService.prototype, 'deleteVehicle')
        .mockRejectedValue(new VehicleNotFoundError());

      const response = await request(app)
        .delete('/api/vehicles/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Vehicle not found',
      });
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should purchase vehicle and return updated quantity when authenticated', async () => {
      const purchasedVehicle = { ...mockVehicle, quantity: 9 };
      const serializedPurchased = {
        ...purchasedVehicle,
        createdAt: purchasedVehicle.createdAt.toISOString(),
        updatedAt: purchasedVehicle.updatedAt.toISOString(),
      };

      jest
        .spyOn(VehicleService.prototype, 'purchaseVehicle')
        .mockResolvedValue(purchasedVehicle);

      const response = await request(app)
        .post('/api/vehicles/veh-uuid-100/purchase')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: serializedPurchased,
      });
    });

    it('should return 400 Bad Request when vehicle is out of stock', async () => {
      jest
        .spyOn(VehicleService.prototype, 'purchaseVehicle')
        .mockRejectedValue(new OutOfStockError());

      const response = await request(app)
        .post('/api/vehicles/veh-uuid-100/purchase')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Vehicle is out of stock',
      });
    });

    it('should return 401 Unauthorized when auth token is missing', async () => {
      const response = await request(app).post('/api/vehicles/veh-uuid-100/purchase');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should restock vehicle when user has ADMIN role', async () => {
      const restockedVehicle = { ...mockVehicle, quantity: 15 };
      const serializedRestocked = {
        ...restockedVehicle,
        createdAt: restockedVehicle.createdAt.toISOString(),
        updatedAt: restockedVehicle.updatedAt.toISOString(),
      };

      jest
        .spyOn(VehicleService.prototype, 'restockVehicle')
        .mockResolvedValue(restockedVehicle);

      const response = await request(app)
        .post('/api/vehicles/veh-uuid-100/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: 5 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: serializedRestocked,
      });
    });

    it('should return 403 Forbidden when non-admin user attempts restock', async () => {
      const response = await request(app)
        .post('/api/vehicles/veh-uuid-100/restock')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ amount: 5 });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 Unauthorized when auth token is missing', async () => {
      const response = await request(app)
        .post('/api/vehicles/veh-uuid-100/restock')
        .send({ amount: 5 });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
