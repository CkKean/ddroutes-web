import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  readonly baseUrl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.DASHBOARD;

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND_ALL, {});
  }
}
