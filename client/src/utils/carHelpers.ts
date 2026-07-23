import type { Vehicle } from '../types';

// Curated realistic luxury automotive photography (Unsplash high-res photos)
const LUXURY_CAR_PHOTOS: Record<string, string> = {
  porsche: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
  bmw: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
  mercedes: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
  audi: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
  tesla: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
  ferrari: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
  lamborghini: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80',
  mclaren: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=800&q=80',
  corvette: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
  aston: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
};

export function getVehicleImage(vehicle: Vehicle): string {
  if (vehicle.imageUrl && vehicle.imageUrl.trim().startsWith('http')) {
    return vehicle.imageUrl;
  }
  const makeLower = vehicle.make.toLowerCase();
  for (const [key, url] of Object.entries(LUXURY_CAR_PHOTOS)) {
    if (makeLower.includes(key)) {
      return url;
    }
  }
  return LUXURY_CAR_PHOTOS.default;
}

// Generate realistic spec sheet details based on vehicle ID/name for data-rich presentation
export function getVehicleSpecs(vehicle: Vehicle) {
  const hash = vehicle.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const isElectric = vehicle.category.toLowerCase().includes('electric') || vehicle.make.toLowerCase().includes('tesla');

  const hp = vehicle.horsepower || (280 + (hash % 450));
  const transmission = vehicle.transmission || (isElectric ? 'Direct Drive' : hash % 2 === 0 ? '7-Speed Dual-Clutch' : '8-Speed Automatic');
  const fuelType = vehicle.fuelType || (isElectric ? 'Electric (100 kWh)' : hash % 3 === 0 ? '93 Octane Premium' : 'Gasoline Twin-Turbo');
  const mileage = vehicle.mileage || ((hash % 12) * 850 + 120);
  const vin = vehicle.vin || `WP0AB2A9${(hash % 900) + 100}RP${(hash % 90000) + 10000}`;
  const year = vehicle.year || (2024 - (hash % 3));

  return {
    year,
    hp,
    transmission,
    fuelType,
    mileage: mileage.toLocaleString(),
    vin,
  };
}
