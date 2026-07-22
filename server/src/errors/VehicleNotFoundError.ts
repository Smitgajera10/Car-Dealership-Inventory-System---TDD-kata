import { AppError } from "./AppError";

export class VehicleNotFoundError extends AppError {
    constructor(){
        super("Vehicle not found" , 404);
    }
}