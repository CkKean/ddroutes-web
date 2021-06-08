import {CourierOrderProofModel} from "./courier-order-proof.model";

export class CourierOrderModel {
  orderId?: string;
  orderNo?: string;
  orderType?: string;
  orderStatus?: string;
  trackingNo?: string;

  senderName?: string;
  senderMobileNo?: string;
  senderEmail?: string;
  senderAddress?: string;
  senderCity?: string;
  senderState?: string;
  senderPostcode?: string;
  fullSenderAddress?: string;
  senderLatitude?: string;
  senderLongitude?: string;
  senderFormattedAddress?: string;

  proofId?: string;
  routeId?: string;
  sortId?: number;

  recipientName?: string;
  recipientMobileNo?: string;
  recipientEmail?: string;
  recipientAddress?: string;
  recipientCity?: string;
  recipientState?: string;
  recipientPostcode?: string;
  fullRecipientAddress?: string;
  recipientLatitude?: string;
  recipientLongitude?: string;
  recipientFormattedAddress?: string;

  itemQty?: number;
  itemType?: string;
  itemWeight?: number;

  paymentMethod?: string;
  vehicleType?: string;
  shippingCost?: number;

  isPickedUp?: boolean;
  pickupOrderStatus?: string;
  pickupProofId?: string;
  pickupSortId?: number;
  pickupRouteId?: string;

  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;

  displayOrderStatus?: string;
  displayOrderType?: string;
  proofInfo?: CourierOrderProofModel;
  pickupProofInfo?: CourierOrderProofModel;
}
