import { Request, Response } from 'express';
import { IVehicleService } from '../services/vehicle.service';
import { VehicleNotFoundError } from '../errors/VehicleNotFoundError';

export class VehicleController {
  constructor(private vehicleService: IVehicleService) {}

  async create(req: Request, res: Response): Promise<Response> {
    const { make, model, category, price, quantity, imageUrl } = req.body;

    const vehicle = await this.vehicleService.addVehicle({
      make,
      model,
      category,
      price: Number(price),
      quantity: Number(quantity),
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

    const vehicles = await this.vehicleService.searchVehicles({
      make: make ? String(make) : undefined,
      model: model ? String(model) : undefined,
      category: category ? String(category) : undefined,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
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

    const vehicle = await this.vehicleService.updateVehicle(id, {
      make,
      model,
      category,
      price: price !== undefined ? Number(price) : undefined,
      quantity: quantity !== undefined ? Number(quantity) : undefined,
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
}
