export class UnhandleCourierOrderModel {
  orderId?: string;
  orderNo?: string;
  orderType?: string;
  orderStatus?: string;
  pickupOrderStatus?: string;
  recipientCity?: string;
  recipientState?: string;
  recipientPostcode?: string;
  recipientLongitude?: string;
  recipientLatitude?: string;
  vehicleType?: string;
  isPickedUp?: boolean;
  createdAt?: Date;
}

export class UnhandleOrderModel {
  uniquePostcode?: string[];
  uniqueState?: string[];
  uniqueVehicle?: string[];
  uniqueCity?: string[];
  courierOrderList?: UnhandleCourierOrderModel[];
}
