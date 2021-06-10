import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {OrderRouteModel} from "../../../shared/model/order-route/order-route.model";
import {deepCopy} from "../../../shared/utils/common.util";
import {TableService} from "../../../shared/services/table.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ModalService} from "../../../shared/services/modal.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {RouteManagementService} from "../../service/route-management.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {SortModel} from "../../../shared/model/order-route/sort.model";
import {CompanyAddressModel} from "../../../shared/model/company-address/company-address.model";
import {RouteOptimizationRequestModel} from "../../../shared/model/order-route/route-optimization-request.model";
import {ListOfOrderStatus, OrderTypeConstant} from "../../../../constant/courier-order.constant";
import {OrderRouteStatusConstant} from "../../../../constant/order-route-status.constant";

@Component({
  selector: 'app-waypoints-list-table',
  templateUrl: './waypoints-list-table.component.html',
  styleUrls: ['./waypoints-list-table.component.scss'],
  providers: [SubHandlingService]
})
export class WaypointsListTableComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() set selectedOrderRoute(data: OrderRouteModel) {
    if (data) {
      this.orderRoute = data;
      this.oriData = deepCopy(data.displayOrderList);
      this.displayData = deepCopy(data.displayOrderList);
      this.departureAddress = data.departureAddress;
    } else {
      this.orderRoute = null;
      this.displayData = [];
      this.departureAddress = null;
    }
  }

  @Input() wayPointsListLoading: boolean;
  @Input() checked: boolean = false;
  @Input() routeDeleted: boolean = false;
  @Output() refreshTable: EventEmitter<string> = new EventEmitter<string>();
  @Output() showMapEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  oriData: CourierOrderModel[] = [];
  displayData: CourierOrderModel[] = [];
  orderRoute: OrderRouteModel;
  departureAddress: CompanyAddressModel;
  optimizeType: string = 'Manual';

  tableHeader = [
    {title: '#', nzWidth: '60px'},
    {title: 'Order No', nzWidth: '150px'},
    {title: 'Tracking Number', nzWidth: '150px'},
    {title: 'Type', nzWidth: '120px'},
    {title: 'Address', nzWidth: '200px'},
    {title: 'Status', nzWidth: '100px'}
  ];

  orderTypeConstant = OrderTypeConstant;
  orderStatusConstant = OrderRouteStatusConstant;

  constructor(private tableService: TableService,
              private subHandlingService: SubHandlingService,
              private modal: ModalService,
              private nzModal: NzModalService,
              private router: Router,
              private route: ActivatedRoute,
              private routeManagementService: RouteManagementService
  ) {
  }

  ngOnInit(): void {
    if (this.routeDeleted) {
      this.oriData = [];
      this.displayData = [];
      this.departureAddress = null;
    }
  }

  drop(event: CdkDragDrop<CourierOrderModel[]>): void {
    moveItemInArray(this.displayData, event.previousIndex, event.currentIndex);
    for (let i = 0; i < this.displayData.length; i++) {
      this.displayData[i].sortId = (i + 1);
    }
  }

  optimizeRoute(): void {
    if (this.orderRoute.status === ListOfOrderStatus.COMPLETED || this.orderRoute.status === ListOfOrderStatus.IN_PROGRESS) {
      this.modal.promptWarningModal('Order route is ' + this.orderRoute.status + '\n .Action denied.', null, 'OK');
      return;
    }
    this.wayPointsListLoading = true;
    let sortList: SortModel[] = [];
    this.displayData.forEach(data => {
      let sortListModel: SortModel = {
        routeId: data.routeId,
        sortId: data.sortId,
        orderNo: data.orderNo
      };
      sortList.push(sortListModel);
    });


    let optimizationModel: RouteOptimizationRequestModel = {
      sortList: sortList,
      optimizeType: this.optimizeType,
      departurePoint: this.orderRoute.departurePoint,
      routeId: this.orderRoute.routeId
    };

    if (this.optimizeType === 'Manual') {
      this.subHandlingService.subscribe(
        this.routeManagementService.manualOptimizeRoute(optimizationModel).pipe(
          tap((response: IResponse<CourierOrderModel[]>) => {
            if (response.success) {
              this.modal.promptSuccessModal('Waypoints are updated.', null, 'OK');
              this.oriData = deepCopy(this.displayData);
              this.refreshTable.emit(this.oriData[0].routeId);

            }
            this.wayPointsListLoading = false;
          })
        )
      )
    } else if (this.optimizeType === 'Automatic') {
      this.subHandlingService.subscribe(
        this.routeManagementService.automaticOptimizeRoute(optimizationModel).pipe(
          tap((response: IResponse<CourierOrderModel[]>) => {
            if (response.success) {
              this.modal.promptSuccessModal('Waypoints are updated.', null, 'OK');
              this.oriData = deepCopy(response.data);
              this.refreshTable.emit(this.oriData[0].routeId);
            }
            this.wayPointsListLoading = false;
          })
        )
      )
    }
  }

  onSelectOptimizeType(type: string): void {
    this.optimizeType = type;
  }

  showMap(): void {
    this.showMapEvent.emit(this.checked);
  }

  search(event): void {
    if (event.target.value) {
      this.displayData = deepCopy(this.oriData);
      this.displayData = this.tableService.search(event.target.value, this.displayData);
    } else {
      this.displayData = deepCopy(this.oriData);
    }
  }

}
