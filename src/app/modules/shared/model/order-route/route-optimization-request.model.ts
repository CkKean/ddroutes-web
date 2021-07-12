import {CourierOrderModel} from "../courier-order/courier-order.model";

export class RouteOptimizationRequestModel {
  sortList: CourierOrderModel[];
  optimizeType: string;
  routeId: string;
  departurePoint: number;
};
