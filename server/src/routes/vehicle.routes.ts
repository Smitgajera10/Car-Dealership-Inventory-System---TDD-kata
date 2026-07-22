import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { VehicleService } from '../services/vehicle.service';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { asyncHandler } from '../middleware/async-handler';

const router = Router();

const vehicleRepository = new VehicleRepository();
const vehicleService = new VehicleService(vehicleRepository);
const vehicleController = new VehicleController(vehicleService);

router.get('/', asyncHandler(vehicleController.getAll.bind(vehicleController)));
router.get('/search', asyncHandler(vehicleController.search.bind(vehicleController)));
router.get('/:id', asyncHandler(vehicleController.getById.bind(vehicleController)));

router.post(
  '/',
  authenticateToken,
  asyncHandler(vehicleController.create.bind(vehicleController))
);

router.put(
  '/:id',
  authenticateToken,
  asyncHandler(vehicleController.update.bind(vehicleController))
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  asyncHandler(vehicleController.delete.bind(vehicleController))
);

export default router;
