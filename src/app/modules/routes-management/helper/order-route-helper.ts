import {CourierOrderModel} from "../../shared/model/courier-order/courier-order.model";
import {OrderTypeConstant} from "../../../constant/courier-order.constant";

export function getDisplayOrderType(order: CourierOrderModel): string {
  return order.orderType + (order.isPickedUp ? (' -> ' + OrderTypeConstant.DELIVERY) : '')
}

export function getDisplayOrderTypeWithRouteId(order: CourierOrderModel, routeId: String): string {
  if (order.orderType === OrderTypeConstant.PICK_UP) {
    if (order.isPickedUp) {
      if (order.pickupRouteId === routeId) {
        return order.orderType;
      } else {
        return order.orderType + ' -> ' + OrderTypeConstant.DELIVERY;
      }
    } else if (!order.isPickedUp) {
      if (order.routeId === routeId) {
        return order.orderType;
      }
    }
  } else if (order.orderType === OrderTypeConstant.DELIVERY) {
    return order.orderType;
  }
}

export function getOrderStatus(order: CourierOrderModel): string {
  if (order.orderType === OrderTypeConstant?.PICK_UP && !order.isPickedUp) {
    return order?.pickupOrderStatus;
  } else {
    return order?.orderStatus;
  }
}

export function getOrderStatusWithRouteId(order: CourierOrderModel, routeId: String): string {
  if (order.orderType === OrderTypeConstant.PICK_UP) {
    if (order.isPickedUp) {
      if (order.pickupRouteId === routeId) {
        return order.pickupOrderStatus;
      } else {
        return order.orderStatus;
      }
    } else if (!order.isPickedUp) {
      if (order.routeId === routeId) {
        return order.pickupOrderStatus;
      }
    }
  } else if (order.orderType === OrderTypeConstant.DELIVERY) {
    return order.orderStatus;
  }
}
