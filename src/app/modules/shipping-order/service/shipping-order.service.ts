import {Injectable} from "@angular/core";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";
import {HttpClient} from "@angular/common/http";
import {CourierOrderModel} from "../../shared/model/courier-order/courier-order.model";

@Injectable({
  providedIn: 'root'
})
export class ShippingOrderService {
  readonly baseUrl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.SHIPPING_ORDER;

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND_ALL, {});
  }

  findByOrderNo(orderNo: string) {
    const params = {orderNo: orderNo};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND, {params: params});
  }

  createShippingOrder(shippingOrder: CourierOrderModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.CREATE, shippingOrder, {});
  }

  getShippingCost(courierOrder: CourierOrderModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.SHIPPING_COST, courierOrder, {});
  }

  getVehicleType() {
    return this.http.get<any>(this.baseUrl  + ApiRoutesConstant.TYPE, {});
  }
}
