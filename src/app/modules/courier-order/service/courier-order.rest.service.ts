import {Injectable} from "@angular/core";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";
import {HttpClient} from "@angular/common/http";
import {CourierOrderModel} from "../../shared/model/courier-order/courier-order.model";

@Injectable({
  providedIn: 'root'
})
export class CourierOrderRestService {

  readonly baseUrl = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.COURIER_ORDER;

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND_ALL, {});
  }

  findAllByOrderStatus(orderStatus: string) {
    const params = {orderStatus: orderStatus};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND + ApiRoutesConstant.ORDER_STATUS, {params: params});
  }

  findByOrderNo(orderNo: string) {
    const params = {orderNo: orderNo};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND + ApiRoutesConstant.ORDER_NO, {params: params});
  }

  findByOrderId(orderId: string) {
    const params = {orderId: orderId};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND + ApiRoutesConstant.ORDER_ID, {params: params});
  }

  findByTrackingNo(trackingNo: string) {
    const params = {trackingNo: trackingNo};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND + ApiRoutesConstant.TRACKING_NO, {params: params});
  }

  deleteCourierOrder(orderNo: string) {
    const params = {orderNo: orderNo};
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.DELETE, {}, {params: params});
  }

  createCourierOrder(courierOrder: CourierOrderModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.CREATE, courierOrder, {});
  }

  updateCourierOrder(courierOrder: CourierOrderModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.UPDATE, courierOrder, {});
  }

  getShippingCost(courierOrder: CourierOrderModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.SHIPPING_COST, courierOrder, {});
  }

  getVehicleType() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.TYPE, {});
  }

}
