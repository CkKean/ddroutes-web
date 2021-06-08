import {Component, OnInit} from '@angular/core';
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {RouteManagementService} from "../../../routes-management/service/route-management.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {TableService} from "../../../shared/services/table.service";
import {deepCopy} from "../../../shared/utils/common.util";
import {ActivatedRoute, Router} from "@angular/router";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {CompanyAddressModel} from "../../../shared/model/company-address/company-address.model";
import {CompanyAddressService} from "../../../company-address/service/company-address.service";
import {DashboardService} from "../../service/dashboard.service";
import {forkJoin} from "rxjs";
import {DashboardModel} from "../../../shared/model/dashboard/dashboard.model";

@Component({
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  providers: [SubHandlingService]
})
export class DashboardPageComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  courierOrderList: CourierOrderModel[];
  displayOrderData: CourierOrderModel[];

  companyAddressList: CompanyAddressModel[];
  displayCompanyAddressData: CompanyAddressModel[];

  dashBoardData: DashboardModel;
  dataLoading: boolean = false;
  routeConstant = RoutesConstant;

  orderTableHeader = [
    {title: 'Order No.', nzWidth: '100px'},
    {title: 'Date', nzWidth: '100px', key: 'createdAt'},
    {title: 'Type', nzWidth: '100px', key: 'orderType'},
    {title: 'Address', nzWidth: '150px', key: 'recipientAddress'},
  ];

  addressTableHeader = [
    {title: 'No.', nzWidth: '60px', key: 'id'},
    {title: 'Address', nzWidth: '150px', key: 'address'},
    {title: 'Postcode', nzWidth: '150px', key: 'postcode'},
    {title: 'City', nzWidth: '150px', key: 'city'},
    {title: 'State', nzWidth: '150px', key: 'state'},
    {title: 'Latitude', nzWidth: '150px', key: 'latitude'},
    {title: 'Longitude', nzWidth: '150px', key: 'longitude'},
  ];

  constructor(private routeManagementService: RouteManagementService,
              private subHandlingService: SubHandlingService,
              private tableService: TableService,
              private router: Router,
              private route: ActivatedRoute,
              private companyAddressService: CompanyAddressService,
              private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData(): void {
    this.dataLoading = true;
    const orderData = this.routeManagementService.findCourierOrder();
    const companyAddressData = this.companyAddressService.findAll();
    const dashboardData = this.dashboardService.findAll();

    forkJoin({
      orderData, companyAddressData, dashboardData
    }).subscribe(({orderData, companyAddressData, dashboardData}) => {
      this.courierOrderList = orderData.data;
      this.displayOrderData = deepCopy(orderData.data.courierOrderList);
      this.companyAddressList = companyAddressData.data;
      this.displayCompanyAddressData = deepCopy(companyAddressData.data);
      this.dashBoardData = dashboardData.data;
      this.dataLoading = false;
    });
  }

  sortOrderList(sortAttribute): void {
    this.displayOrderData = this.tableService.sort(sortAttribute, this.displayOrderData);
  }

  sortCompanyList(sortAttribute): void {
    this.displayCompanyAddressData = this.tableService.sort(sortAttribute, this.displayCompanyAddressData);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
