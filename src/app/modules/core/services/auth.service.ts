import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngxs/store";
import {tap} from "rxjs/operators";
import {ApiRoutesConstant} from "../../../constant/apiroutes.constant";
import {ClearAuthState, SetAuth} from "../state/auth.action";
import {UserTypeConstant} from "../../../constant/user-type.constant";
import {Router} from "@angular/router";
import {AuthStateModel} from "../state/auth.state";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = ApiRoutesConstant.BASE_URL + ApiRoutesConstant.AUTH;

  constructor(private http: HttpClient, private store: Store, private router: Router) {
  }

  login(username, password) {
    return this.http.post<any>(this.baseUrl + ApiRoutesConstant.SIGNIN, {username, password}).pipe(
      tap(res => {
        if (res.success) {
          const now = new Date();
          localStorage.setItem('jwtToken', res.data.jwtToken);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('expiredAt', ((now.getTime() / 1000) + +res.data.expiresIn).toString());
          localStorage.setItem('userInformation', JSON.stringify(res.data.userInformation));
        }
      }),
      tap(res => {
        if (res.success) this.storeUserDetails(res)
      }),
      tap(res => {
        if (res.success) {
          if (res.data.userType === UserTypeConstant.S || res.data.userType === UserTypeConstant.SA) {
            this.router.navigate(['/dashboard']).then();
          } else {
            this.router.navigate(['/']).then();
          }
        }
      })
    );
  }


  storeUserDetails(res) {
    const now = new Date();

    let authModel: AuthStateModel = {
      username: res.data.username,
      userInformation: res.data.userInformation,
      jwtToken: res.data.jwtToken,
      expiredAt: new Date(((now.getTime() / 1000) + +res.data.expiresIn).toString()),
      userType: res.data.userType,
      authenticated: true,
      refreshToken: null,
    }

    if (res.success) {
      this.store.dispatch(new SetAuth(authModel));

    }
  }

  logout(){
    sessionStorage.clear();
    localStorage.clear();
    this.store.dispatch(new ClearAuthState());
    this.router.navigate(['/']);
  }
}
