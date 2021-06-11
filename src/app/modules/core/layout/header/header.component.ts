import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {AppState} from "../../state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {Select, Store} from "@ngxs/store";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {AuthState} from "../../state/auth.state";
import {UserTypeConstant} from 'src/app/constant/user-type.constant';
import {ApiRoutesConstant} from "../../../../constant/apiroutes.constant";
import {User} from "../../../shared/model/register/user.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Select(AuthState.isAuthenticated) isAuthenticated$: Observable<boolean>;
  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  @SelectSnapshot(AuthState.getUserInformation) userInformation: User;
  @SelectSnapshot(AuthState.getRefreshToken) refreshToken;

  @Input() optionDisplay: boolean = true;
  routesConstant = RoutesConstant;
  drawerVisible: boolean = false;
  userTypeConstant = UserTypeConstant;
  logo: string = './assets/img/brand/logo4.png'

  username: string;
  userType: number;
  imageUrl: string;
  imageBase64: string;

  backOfficeMenuList: Array<{ route: string, title: string, icon: string }> = [
    {route: RoutesConstant.DASHBOARD, title: 'Dashboard', icon: 'fas fa-home mr-2'},
    {route: RoutesConstant.COURIER_ORDER, title: 'Courier Order', icon: 'fas fa-shipping-fast mr-2'},
    {route: RoutesConstant.ROUTES_MANAGEMENT, title: 'Routes Management', icon: 'fas fa-route mr-2'},
    {route: RoutesConstant.ORDER_ROUTE_REPORT, title: 'Order Route Report', icon: 'far fa-file-pdf mr-2'},
    {route: RoutesConstant.VEHICLE_MANAGEMENT, title: 'Vehicle Management', icon: 'fas fa-car mr-2'},
    {route: RoutesConstant.PRICE_PLAN, title: 'Price Plan', icon: 'fas fa-dollar-sign mr-2'},
    {
      route: RoutesConstant.COMPANY_ADDRESS_MANAGEMENT,
      title: 'Company Address Management',
      icon: 'fas fa-building mr-2'
    },
  ];

  adminMenuList: Array<{ route: string, title: string, icon: string }> = [
    {route: RoutesConstant.DASHBOARD, title: 'Dashboard', icon: 'fas fa-home mr-2'},
    {route: RoutesConstant.COURIER_ORDER, title: 'Courier Order', icon: 'fas fa-shipping-fast mr-2'},
    {route: RoutesConstant.ROUTES_MANAGEMENT, title: 'Routes Management', icon: 'fas fa-route mr-2'},
    {route: RoutesConstant.ORDER_ROUTE_REPORT, title: 'Order Route Report', icon: 'far fa-file-pdf mr-2'},
    {route: RoutesConstant.EMPLOYEE_RECORD, title: 'Employee Record', icon: 'fas fa-users mr-2'},
    {route: RoutesConstant.COURIER_PERSONNEL_RECORD, title: 'Courier Personnel Record', icon: 'fas fa-running mr-2'},
    {route: RoutesConstant.VEHICLE_MANAGEMENT, title: 'Vehicle Management', icon: 'fas fa-car mr-2'},
    {route: RoutesConstant.PRICE_PLAN, title: 'Price Plan', icon: 'fas fa-dollar-sign mr-2'},
    {
      route: RoutesConstant.COMPANY_ADDRESS_MANAGEMENT,
      title: 'Company Address Management',
      icon: 'fas fa-building mr-2'
    },
  ];

  normalUserMenuList: Array<{ route: string, title: string, }> = [
    {route: RoutesConstant.SHIPPING_ORDER, title: 'My Shipping Order'},
    {route: RoutesConstant.CREATE_SHIPPING_ORDER, title: 'Make Order'},
  ];

  isMainPage: boolean = false;

  constructor(private store: Store, private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    if (this.userInformation != null) {
      this.username = this.userInformation.username;
      this.userType = this.userInformation.userType;
      if (this.userInformation.profileImgPath && this.userInformation.profileImg) {
        this.imageUrl = ApiRoutesConstant.IMAGE_API + this.userInformation.profileImgPath + '/' + this.userInformation.profileImg;
      }
    }

    if (this.router.url === '/' && (this.userType === UserTypeConstant.S || this.userType === UserTypeConstant.SA)) {
      this.isMainPage = true;
    }
  }

  navigateLoginPage(): void {
    this.router.navigate([RoutesConstant.LOGIN]);
  }

  navigateRegisterPage(): void {
    this.router.navigate([RoutesConstant.REGISTER]);
  }

  navigateToMainPage(): void {
    this.router.navigate(['/']);
  }

  navigateToTrackingPage(): void {
    this.router.navigate([RoutesConstant.TRACKING]);
  }

  navigatePage(route: string): void {
    this.router.navigate([route]);
  }

  openDrawer(): void {
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
