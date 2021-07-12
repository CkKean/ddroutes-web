import {CourierOrderModel} from "../courier-order/courier-order.model";
import {OrderRouteModel} from "../order-route/order-route.model";
import {VehicleModel} from "../vehicle/vehicle.model";

export class RouteReportModel {
  routeReportId?: string;
  actualPetrolFees?: number;

  calculatedDistanceTravel?: number;
  calculatedPetrolFees?: number;
  calculatedPetrolUsage?: number;
  latestPetrolPrice?: number;

  totalItemsQty?: number;

  statement?: string;
  statementPath?: string;
  routeId?: string;

  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;

  vehicle_id?: string;

  totalTimeUsed?: string;
  orderList?: CourierOrderModel[];
  orderRoute?: OrderRouteModel;
  vehicleInfo?: VehicleModel;
}
