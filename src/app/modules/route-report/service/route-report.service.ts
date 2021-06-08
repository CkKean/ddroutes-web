import {Injectable} from "@angular/core";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";
import {HttpClient} from "@angular/common/http";
import {RouteReportModel} from "../../shared/model/route-report/route-report.model";

@Injectable({
  providedIn: 'root'
})
export class RouteReportService {

  readonly baseurl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.ORDER_ROUTE_REPORT;

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<any>(this.baseurl + ApiRoutesConstant.FIND_ALL, {});
  }

  findOne(routeReportId: string) {
    const params = {routeReportId: routeReportId};
    return this.http.get<any>(this.baseurl + ApiRoutesConstant.FIND, {params: params});
  }

  updateRouteReport(formData: FormData) {
    return this.http.post<any>(this.baseurl + ApiRoutesConstant.UPDATE, formData);
  }

  deleteRouteReport(routeReportId: string) {
    const params = {routeReportId: routeReportId};
    return this.http.post<any>(this.baseurl + ApiRoutesConstant.DELETE, {}, {params: params});
  }
}
