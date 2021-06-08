import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree,} from '@angular/router';
import {Observable} from "rxjs/internal/Observable";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {JwtUtil} from "../../shared/utils/jwt.util";
import {RoutesConstant} from "../../../constant/routes.constant";
import {AuthState, AuthStateModel} from "../state/auth.state";
import {UserTypeConstant} from "../../../constant/user-type.constant";
import {ModalService} from "../../shared/services/modal.service";
import {User} from "../../shared/model/register/user.model";
import {Store} from "@ngxs/store";
import {SetAuth} from "../state/auth.action";

@Injectable()
export class AuthGuard implements CanActivateChild {

  @SelectSnapshot(AuthState.isAuthenticated) isAuthenticated;

  constructor(public jwtUtil: JwtUtil,
              public store: Store,
              public router: Router,
              private modal: ModalService
  ) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let path: string = state.url;
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

      if (userInformation.userType === UserTypeConstant.S || userInformation.userType === UserTypeConstant.SA) {
        if ((path === this.matchRoute(RoutesConstant.EMPLOYEE_RECORD) && userInformation.userType === UserTypeConstant.S) ||
          (path === this.matchRoute(RoutesConstant.CREATE_SHIPPING_ORDER)) ||
          (path === this.matchRoute(RoutesConstant.SHIPPING_ORDER))) {
          this.modal.promptErrorModal('The requested URL could not be retrieved.', null, 'OK');
          this.router.navigate([RoutesConstant.DASHBOARD]);
          return false;
        }
        return true;
      } else {
        if ((path === this.matchRoute(RoutesConstant.CREATE_SHIPPING_ORDER)) ||
          (path.match(RoutesConstant.SHIPPING_ORDER)) ||
          (path === this.matchRoute(RoutesConstant.SHIPPING_ORDER))) {
          return true;
        } else {
          this.modal.promptErrorModal('The requested URL could not be retrieved.', null, 'OK');
          this.router.navigate(['/']);
          return false;
        }
      }
    }

    this.router.navigate([RoutesConstant.LOGIN]);
    return true;
  }

  private matchRoute(route: string) {
    return '/' + route;
  }
}
