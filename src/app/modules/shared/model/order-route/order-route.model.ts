import {CourierOrderModel} from "../courier-order/courier-order.model";
import {User} from "../register/user.model";
import {CompanyAddressModel} from "../company-address/company-address.model";
import {VehicleModel} from "../vehicle/vehicle.model";

export class OrderRouteModel {
  routeId?: string;
  departurePoint?: number;
  roundTrip?: boolean;
  departureDate?: Date;
  departureTime?: Date;

  personnel?: string
  completed?: number;

  status?: string;
  timeNeeded?: number;
  totalDistance?: number;
  vehicleId?: string;

  orderList?: CourierOrderModel[];
  displayOrderList?: CourierOrderModel[];
  departureAddress?: CompanyAddressModel;

  personnelInfo?: User;
  createdByInfo?: User;
  vehicleInfo?: VehicleModel;

  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

