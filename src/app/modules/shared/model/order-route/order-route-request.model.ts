import {CourierOrderModel} from "../courier-order/courier-order.model";

export class OrderRouteRequestModel {
  departurePoint?: number;
  roundTrip?: boolean;
  departureDate?: Date;
  departureTime?: number;
  personnel?: string;
  totalItemsQty?: number;
  vehicle?: string;
  orderList?: CourierOrderModel[];
  orderDeletedList?: CourierOrderModel[];
  routeId?: string;
}
