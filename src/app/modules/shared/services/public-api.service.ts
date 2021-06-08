import {Injectable} from "@angular/core";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {
  readonly baseUrl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.PUBLIC;

  constructor(private http: HttpClient) {
  }

  findByOrderNo(orderNo: string) {
    const params = {orderNo: orderNo};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND + ApiRoutesConstant.ORDER_NO, {params: params});
  }

}
