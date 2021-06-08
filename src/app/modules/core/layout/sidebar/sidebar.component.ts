import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RoutesConstant} from "../../../../constant/routes.constant";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {AuthState} from "../../state/auth.state";
import {User} from "../../../shared/model/register/user.model";
import {UserTypeConstant} from "../../../../constant/user-type.constant";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  routesConstant = RoutesConstant;
  isCollapsed: boolean = false;

  @SelectSnapshot(AuthState.getUserInformation) userInformation: User;
  @Output() collapsedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

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

  staffMenuList: Array<{ route: string, title: string, icon: string }> = [
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

  menuList: Array<{ route: string, title: string, icon: string }> = [];

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    if (this.userInformation.userType === UserTypeConstant.S) {
      this.menuList = this.staffMenuList;
    } else if (this.userInformation.userType === UserTypeConstant.SA) {
      this.menuList = this.adminMenuList;
    }
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedEvent.emit(this.isCollapsed);
  }

  logout(): void {
    this.authService.logout();
  }
}
