import { Request, Response } from 'express';
import { IVehicleService } from '../services/vehicle.service';
import { VehicleNotFoundError } from '../errors/VehicleNotFoundError';

export class VehicleController {
  constructor(private vehicleService: IVehicleService) {}

  async create(req: Request, res: Response): Promise<Response> {
    const { make, model, category, price, quantity, imageUrl } = req.body;

    const numPrice = Number(price);
    const numQuantity = Number(quantity);

    if (price === undefined || Number.isNaN(numPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid number',
      });
    }

    if (quantity === undefined || Number.isNaN(numQuantity)) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a valid number',
      });
    }

    const vehicle = await this.vehicleService.addVehicle({
      make,
      model,
      category,
      price: numPrice,
      quantity: numQuantity,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      data: vehicle,
    });
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const vehicles = await this.vehicleService.getAllVehicles();

    return res.status(200).json({
      success: true,
      data: vehicles,
    });
  }

  async search(req: Request, res: Response): Promise<Response> {
    const { make, model, category, minPrice, maxPrice } = req.query;

    const parsedMinPrice = minPrice !== undefined ? Number(minPrice) : undefined;
    const parsedMaxPrice = maxPrice !== undefined ? Number(maxPrice) : undefined;

    if (parsedMinPrice !== undefined && Number.isNaN(parsedMinPrice)) {
      return res.status(400).json({
        success: false,
        message: 'minPrice must be a valid number',
      });
    }

    if (parsedMaxPrice !== undefined && Number.isNaN(parsedMaxPrice)) {
      return res.status(400).json({
        success: false,
        message: 'maxPrice must be a valid number',
      });
    }

    const vehicles = await this.vehicleService.searchVehicles({
      make: make ? String(make) : undefined,
      model: model ? String(model) : undefined,
      category: category ? String(category) : undefined,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
    });

    return res.status(200).json({
      success: true,
      data: vehicles,
    });
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const vehicle = await this.vehicleService.getVehicleById(id);
    if (!vehicle) {
      throw new VehicleNotFoundError();
    }

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { make, model, category, price, quantity, imageUrl } = req.body;

    const parsedPrice = price !== undefined ? Number(price) : undefined;
    const parsedQuantity = quantity !== undefined ? Number(quantity) : undefined;

    if (parsedPrice !== undefined && Number.isNaN(parsedPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid number',
      });
    }

    if (parsedQuantity !== undefined && Number.isNaN(parsedQuantity)) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a valid number',
      });
    }

    const vehicle = await this.vehicleService.updateVehicle(id, {
      make,
      model,
      category,
      price: parsedPrice,
      quantity: parsedQuantity,
      imageUrl,
    });

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const vehicle = await this.vehicleService.deleteVehicle(id);

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  }

  async purchase(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = req.user!.id;

    const result = await this.vehicleService.purchaseVehicle(id, userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  async restock(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { amount } = req.body;

    const numAmount = Number(amount);

    if (amount === undefined || Number.isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Restock amount must be greater than 0',
      });
    }

    const vehicle = await this.vehicleService.restockVehicle(id, numAmount);

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  }
}
