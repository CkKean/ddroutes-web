import {Injectable} from "@angular/core";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  readonly baseUrl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.TRACKING;

  constructor(private http: HttpClient) {
  }

  trackOrder(trackingOrderNo: string) {
    const params = {trackingOrderNo: trackingOrderNo};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND, {params: params});
  }
}
