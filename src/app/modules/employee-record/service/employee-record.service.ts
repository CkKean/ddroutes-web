import {Injectable} from "@angular/core";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EmployeeRecordService {

  baseUrl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.USER;

  constructor(private http: HttpClient) {
  }

  findAll(userType: number) {
    const params = {userType: userType.toString()};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND_ALL, {params: params});
  }

  findOne(username: string) {
    const params = {username: username};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND, {params: params});
  }

  delete(username: string) {
    const params = {userType: "1", username: username};
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.DELETE, {}, {params: params});
  }

  update(formData: FormData) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.UPDATE, formData);
  }

  create(formData: FormData) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.CREATE, formData);
  }

  findStaffByPosition(position: string) {
    const params = {position: position};
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND + ApiRoutesConstant.POSITION, {params: params});
  }

  findAllCourierPersonnel() {
    return this.http.get<any>(this.baseUrl + ApiRoutesConstant.FIND + ApiRoutesConstant.COURIER_PERSONNEL, {});
  }
}
