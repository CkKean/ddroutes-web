import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";
import {CompanyAddressModel} from "../../shared/model/company-address/company-address.model";

@Injectable({
  providedIn: 'root'
})
export class CompanyAddressService {

  readonly baseUrl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.COMPANY_ADDRESS;

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND_ALL, {});
  }

  findOne(id: number) {
    const params = {id: id.toString()};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND, {params: params});
  }

  create(companyAddressModel: CompanyAddressModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.CREATE, companyAddressModel, {});
  }

  update(companyAddressModel: CompanyAddressModel) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.UPDATE, companyAddressModel, {});
  }

  delete(id: number) {
    const params = {id: id.toString()};
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.DELETE, {}, {params: params});
  }
}
