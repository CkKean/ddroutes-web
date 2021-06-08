import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree,} from '@angular/router';
import {Observable} from "rxjs/internal/Observable";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {AuthState, AuthStateModel} from "../state/auth.state";
import {User} from "../../shared/model/register/user.model";
import {Store} from "@ngxs/store";
import {SetAuth} from "../state/auth.action";

@Injectable()
export class SessionGuard implements CanActivate {

  @SelectSnapshot(AuthState.isAuthenticated) isAuthenticated;

  constructor(public store: Store, public router: Router) {
  }

  canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let jwtToken: string;
    let expiredAt: string;
    let userInformation: User;
    let isLoggedIn: boolean;
    let currentDateTime = new Date;

    jwtToken = localStorage.getItem('jwtToken');
    expiredAt = localStorage.getItem('expiredAt');
    userInformation = JSON.parse(localStorage.getItem('userInformation')) as User;
    isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' ? true : false;

    if (jwtToken && ((currentDateTime.getTime() / 1000) < +expiredAt) && isLoggedIn) {
      let authModel: AuthStateModel = {
        username: userInformation.username,
        userInformation: userInformation,
        jwtToken: jwtToken,
        expiredAt: new Date(expiredAt),
        userType: userInformation.userType,
        authenticated: isLoggedIn,
        refreshToken: null,
      }

      if (!this.isAuthenticated)
        this.store.dispatch(new SetAuth(authModel));
    }

    return true;
  }
}
