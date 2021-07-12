export class CourierOrderProofModel {
  proofId?: string;
  courierPersonnelId?: string;
  signature?: string;
  signaturePath?: string;
  status?: string;
  reason?: string;
  pickedAt?: Date;
  receivedAt?: Date;
  recipientName?: string;
  recipientIcNo?: string;
  arrivedAt?: Date;
  createdBy?: string;
  createdAt?: Date;

  deliveryPersonnel?: string;
  pickupPersonnel?: string;
}
