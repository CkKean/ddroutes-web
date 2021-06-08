import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";
import {PricePlanModel} from "../../shared/model/price-plan/price-plan.model";

@Injectable({
  providedIn: 'root'
})
export class PricePlanService {

  readonly baseUrl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.PRICE_PLAN;

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND_ALL, {});
  }

  findOne(pricePlanId: string) {
    const params = {pricePlanId: pricePlanId};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND, {params: params});
  }


  createPricePlan(pricePlanModel: PricePlanModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.CREATE, pricePlanModel, {});
  }

  deletePricePlan(pricePlanId: string) {
    const params = {pricePlanId: pricePlanId};
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.DELETE, {}, {params: params});
  }

  updatePricePlan(pricePlanModel: PricePlanModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.UPDATE, pricePlanModel, {});
  }
}
