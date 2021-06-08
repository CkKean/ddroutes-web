export class OrderStatusModel {
  orderNo?: string;
  trackingNo?: string;
  orderType?: string;
  orderStatus?: string;
  routeStatus?: string;
  pickupOrderStatus?: string;
  pickupReason?:string;
  deliveryReason?:string;
  step?: number;
  orderPlacedAt?: Date;
  orderPickedAt?: Date;
  orderComingAt?: Date;
  orderShippedAt?: Date;
  orderReceivedAt?: Date;
  orderCompletedAt?: Date;
}
