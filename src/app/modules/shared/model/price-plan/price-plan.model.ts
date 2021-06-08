export class PricePlanModel {
  pricePlanId?: string;
  vehicleType?: string;
  defaultWeightPrefix?: string;
  defaultWeight?: number;
  defaultWeightUnit?: string;
  defaultDistancePrefix?: string;
  defaultDistance?: number;
  defaultDistanceUnit?: string;
  defaultPricing?: number;
  subDistance?: number;
  subDistancePricing?: number;
  subDistanceUnit?: string;
  subWeight?: number;
  subWeightPricing?: number;
  subWeightUnit?: string;
}
