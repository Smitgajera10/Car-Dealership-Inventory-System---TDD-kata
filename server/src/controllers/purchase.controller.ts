import { Request, Response } from 'express';
import { IPurchaseRepository } from '../repositories/purchase.repository';

export class PurchaseController {
  constructor(private purchaseRepository: IPurchaseRepository) {}

  async getMyPurchases(req: Request, res: Response): Promise<Response> {
    const userId = req.user!.id;

    const purchases = await this.purchaseRepository.findByUserId(userId);

    return res.status(200).json({
      success: true,
      data: purchases,
    });
  }

  async getAllPurchases(req: Request, res: Response): Promise<Response> {
    const purchases = await this.purchaseRepository.findAll();

    return res.status(200).json({
      success: true,
      data: purchases,
    });
  }
}
