export class VehicleModel {
  id: number;
  vehicleId: string;
  plateNo: string;
  brand: string;
  model: string;
  color: string;
  fuelEfficiency: number;
  fuelEfficiencyUnit: string;
  fuelTank: number;
  type: string;
  owner: string;
  gpsTrackNo?: string;
  photo?: string;
  photoPath?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
