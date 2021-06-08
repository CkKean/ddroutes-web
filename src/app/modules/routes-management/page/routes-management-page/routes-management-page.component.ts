import {Component, OnInit} from '@angular/core';
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {RouteManagementService} from "../../service/route-management.service";
import {OrderRouteModel} from "../../../shared/model/order-route/order-route.model";
import {CompanyAddressModel} from "../../../shared/model/company-address/company-address.model";
import {deepCopy} from "../../../shared/utils/common.util";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs";
import {UnhandleOrderModel} from "../../../shared/model/courier-order/unhandle-courier-order-model";

@Component({
  templateUrl: './routes-management-page.component.html',
  styleUrls: ['./routes-management-page.component.scss'],
  providers: [SubHandlingService]
})
export class RoutesManagementPageComponent implements OnInit {
  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  courierOrderList: UnhandleOrderModel;
  orderLoading: boolean = false;

  orderRouteList: OrderRouteModel[];
  orderRouteLoading: boolean = false;

  orderList: CourierOrderModel[] = [];
  departureAddress: CompanyAddressModel;

  selectedRouteId: string
  selectedOrderRoute: OrderRouteModel;
  routeDeleted: boolean = false;
  mapVisible: boolean = false;

  constructor(private routeManagementService: RouteManagementService,
              private subHandlingService: SubHandlingService) {
  }

  ngOnInit() {
    this.getAllCourierOrder();
    this.getAllOrderRoute();
  }

  getAllCourierOrder(): void {
    this.orderLoading = true;
    this.subHandlingService.subscribe(
      this.routeManagementService.findCourierOrder().pipe(
        tap((response: IResponse<UnhandleOrderModel>) => {
          this.courierOrderList = response.data;
          this.orderLoading = false;
        })
      )
    );
  }

  getAllOrderRoute(selectedRouteId?: string): void {
    this.orderRouteLoading = true;
    this.subHandlingService.subscribe(
      this.routeManagementService.findAll().pipe(
        tap((response: IResponse<OrderRouteModel[]>) => {
          if (response.success) {
            this.orderRouteList = deepCopy(response.data);
            this.orderRouteLoading = false;
            if (selectedRouteId) {
              this.selectedRouteId = selectedRouteId;
              let selectedOrderRoute: OrderRouteModel = this.orderRouteList.find(route => route.routeId === selectedRouteId);
              this.departureAddress = selectedOrderRoute.departureAddress;
              this.selectedOrderRoute = selectedOrderRoute;
            }
            this.routeDeleted = false;
          }
        })
      )
    )
  }

  getSelectedOrderRoute(orderRoute: OrderRouteModel): void {
    this.selectedOrderRoute = orderRoute;
    this.routeDeleted = false;
  }

  refreshOrderList(): void {
    this.getAllCourierOrder();
    this.routeDeleted = false;
  }

  orderListDeleted(): void {
    this.getAllCourierOrder();
    this.routeDeleted = true;
  }

  showMap(event: boolean): void {
    this.mapVisible = event;
  }

}
