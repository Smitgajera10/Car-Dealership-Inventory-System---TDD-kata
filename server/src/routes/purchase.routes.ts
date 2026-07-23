import { Router } from 'express';
import { PurchaseController } from '../controllers/purchase.controller';
import { PurchaseRepository } from '../repositories/purchase.repository';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { asyncHandler } from '../middleware/async-handler';

const router = Router();

const purchaseRepository = new PurchaseRepository();
const purchaseController = new PurchaseController(purchaseRepository);

// GET /api/purchases/my — current user's own purchase history
router.get(
  '/my',
  authenticateToken,
  asyncHandler(purchaseController.getMyPurchases.bind(purchaseController))
);

// GET /api/purchases — all purchases (Admin only — Sales Ledger)
router.get(
  '/',
  authenticateToken,
  requireAdmin,
  asyncHandler(purchaseController.getAllPurchases.bind(purchaseController))
);

export default router;
