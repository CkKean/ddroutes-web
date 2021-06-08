import {Injectable} from "@angular/core";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";
import {HttpClient} from "@angular/common/http";
import {OrderRouteRequestModel} from "../../shared/model/order-route/order-route-request.model";
import {RouteOptimizationRequestModel} from "../../shared/model/order-route/route-optimization-request.model";

@Injectable({
  providedIn: 'root'
})
export class RouteManagementService {

  readonly baseUrl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.ORDER_ROUTE;

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND_ALL, {});
  }

  findByRouteStatus(status: string, vehicleType: string) {
    const params = {status: status, vehicleType: vehicleType};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND + ApiRoutesConstant.STATUS, {params: params});
  }

  findCourierPersonnel() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND + ApiRoutesConstant.COURIER_PERSONNEL, {});
  }

  findVehiclePersonnel(vehicleType: string, selectedDate: string,routeId: string) {
    const params = {vehicleType: vehicleType, selectedDate: selectedDate,routeId:routeId};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND + ApiRoutesConstant.VEHICLE_PERSONNEL, {params: params});
  }

  findCompanyAddress() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND + ApiRoutesConstant.COMPANY_ADDRESS, {});
  }

  findCourierOrder() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND + ApiRoutesConstant.COURIER_ORDER, {});
  }

  createOrderRoute(orderRoute: OrderRouteRequestModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.CREATE, orderRoute, {});
  }

  deleteOrderRoute(routeId: string) {
    const params = {routeId: routeId};
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.DELETE, {}, {params: params});
  }

  updateOrderRoute(orderRoute: OrderRouteRequestModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.UPDATE, orderRoute, {});
  }

  manualOptimizeRoute(routeOptimizationRequestModel: RouteOptimizationRequestModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.MANUAL + ApiRoutesConstant.OPTIMIZE, routeOptimizationRequestModel, {});
  }

  automaticOptimizeRoute(routeOptimizationRequestModel: RouteOptimizationRequestModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.AUTO + ApiRoutesConstant.OPTIMIZE, routeOptimizationRequestModel, {});
  }

  submitAddToRoute(orderRoute: OrderRouteRequestModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.ADD_ORDER, orderRoute, {});
  }
}
