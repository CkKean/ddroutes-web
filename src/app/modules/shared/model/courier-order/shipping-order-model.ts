import {CourierOrderModel} from "./courier-order.model";

export class ShippingOrderModel{
  allOrder:CourierOrderModel[];
  completedList:CourierOrderModel[];
  failedList:CourierOrderModel[];
  pickedUpList:CourierOrderModel[];
  pendingList:CourierOrderModel[];
  inProgressList:CourierOrderModel[];
}
