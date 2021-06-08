export class OrderInvoiceModel {
  senderName?: string;
  senderAddress?: string;
  senderCity?: string;
  senderState?: string;
  senderPostcode?: string;

  recipientName?: string;
  recipientMobileNo?: string;
  recipientEmail?: string;
  recipientAddress?: string;
  recipientCity?: string;
  recipientState?: string;
  recipientPostcode?: string;

  itemQty?: number;
  itemType?: string;
  itemWeight?: number;

  shippingCost?: number;

  orderNo?: string;
  trackingNo?: string;
  createdAt?: Date;
}
