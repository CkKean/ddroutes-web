import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";
import {User} from "../../shared/model/register/user.model";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  readonly baseUrl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.AUTH;

  constructor(private http: HttpClient) {
  }

  verifyUsername(username: string) {
    const params = {username: username};
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.VERIFY + ApiRoutesConstant.USERNAME, {}, {params: params});
  }

  verifyEmail(email: string) {
    const params = {email: email};
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.VERIFY + ApiRoutesConstant.EMAIL, {}, {params: params});
  }

  signup(user: User) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.SIGNUP, user);
  }

}
