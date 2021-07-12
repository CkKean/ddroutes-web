export class OrderStatusModel {
  orderNo?: string;
  trackingNo?: string;
  orderType?: string;
  orderStatus?: string;
  routeStatus?: string;
  pickupOrderStatus?: string;
  pickupReason?: string;
  deliveryReason?: string;
  step?: number;
  orderPlacedAt?: Date;
  orderPickedAt?: Date;
  orderComingAt?: Date;
  orderEstComingAt?: Date;
  orderShippedAt?: Date;
  orderEstShippedAt?: Date;
  orderReceivedAt?: Date;
  orderCompletedAt?: Date;
}
