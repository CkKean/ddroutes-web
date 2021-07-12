import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {deepCopy} from "../../../shared/utils/common.util";
import {TableService} from "../../../shared/services/table.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {CreateRouteFormComponent} from "../create-route-form/create-route-form.component";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {RouteManagementService} from "../../service/route-management.service";
import {OrderRouteStatusConstant} from "../../../../constant/order-route-status.constant";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {OrderRouteRequestModel} from "../../../shared/model/order-route/order-route-request.model";
import {ModalService} from "../../../shared/services/modal.service";
import {ListOfOrderStatus} from "../../../../constant/courier-order.constant";
import {
  UnhandleCourierOrderModel,
  UnhandleOrderModel
} from "../../../shared/model/courier-order/unhandle-courier-order-model";

@Component({
  selector: 'app-order-list-table',
  templateUrl: './order-list-table.component.html',
  styleUrls: ['./order-list-table.component.scss'],
  providers: [SubHandlingService]
})
export class OrderListTableComponent implements AfterViewChecked, OnInit {
  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() set courierOrderList(data: UnhandleOrderModel) {
    if (data) {
      this.oriData = deepCopy(data.courierOrderList);
      this.displayData = deepCopy(data.courierOrderList);
      this.postcodeList = [];
      this.stateList = [];
      this.vehicleList = [];
      data.uniquePostcode.forEach(value => {
        this.postcodeList.push({text: value, value: value});
      });
      data.uniqueState.forEach(value => {
        this.stateList.push({text: value, value: value});
      })
      data.uniqueVehicle.forEach(value => {
        this.vehicleList.push({text: value, value: value});
      })
      data.uniqueCity.forEach(value => {
        this.cityList.push({text: value, value: value});
      })
      this.setHeader();
    }
  }

  @Input() orderLoading: boolean;
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshRouteTable: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(CreateRouteFormComponent) orderRouteFrom: CreateRouteFormComponent;
  oriData: CourierOrderModel[] = [];
  displayData: CourierOrderModel[] = [];
  postcodeList: Array<{ text: String, value: String }> = [];
  stateList: Array<{ text: String, value: String }> = [];
  vehicleList: Array<{ text: String, value: String }> = [];
  cityList: Array<{ text: String, value: String }> = [];

  tableHeader;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  listOfCurrentPageData: UnhandleCourierOrderModel[] = [];
  selectedOrder: UnhandleCourierOrderModel[] = [];

  createRouteVisible: boolean = false;
  createRouteDisable: boolean = true;

  submitCreateRouteLoading: boolean = false;

  addToExistingRouteForm: FormGroup;
  routeListLoading: boolean = false;
  routeIdList: Array<{ routeId: string }> = [];
  addToRouteVisible: boolean = false;
  submitAddToRouteLoading: boolean = false;

  orderStatusConstant = ListOfOrderStatus;

  constructor(private tableService: TableService,
              private cdr: ChangeDetectorRef,
              private subHandlingService: SubHandlingService,
              private routeManagementService: RouteManagementService,
              private modal: ModalService) {
  }

  ngOnInit(): void {
    this.initAddToExistingRouteForm();
    this.setHeader();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  setHeader(): void {
    this.tableHeader = [
      {title: 'Tracking No.', nzWidth: '100px'},
      {title: 'Date', nzWidth: '110px', key: 'createdAt'},
      {title: 'Type', nzWidth: '100px', key: 'displayOrderType'},
      {
        title: 'Vehicle', nzWidth: '100px', key: 'vehicleType',
        listOfFilter: this.vehicleList,
        filterFn: (list: string[], item: UnhandleCourierOrderModel) => {
          return list.some(vehicle => item.vehicleType.indexOf(vehicle) !== -1);
        }
      },
      {title: 'Address', nzWidth: '150px', key: 'recipientAddress'},
      {
        title: 'Postcode', nzWidth: '110px', key: 'recipientPostcode',
        listOfFilter: this.postcodeList,
        filterFn: (list: string[], item: UnhandleCourierOrderModel) => {
          return list.some(postcode => item.recipientPostcode.indexOf(postcode) !== -1);
        }
      },
      {
        title: 'City', nzWidth: '100px', key: 'recipientCity',
        listOfFilter: this.cityList,
        filterFn: (list: string[], item: UnhandleCourierOrderModel) => {
          return list.some(postcode => item.recipientCity.indexOf(postcode) !== -1);
        }
      },
      {
        title: 'State', nzWidth: '100px', key: 'recipientState',
        listOfFilter: this.stateList,
        filterFn: (list: string[], item: UnhandleCourierOrderModel) => {
          return list.some(state => item.recipientState.indexOf(state) !== -1);
        }
      },
    ];
  }

  initAddToExistingRouteForm(): void {
    this.addToExistingRouteForm = new FormGroup({
      routeId: new FormControl(null, Validators.required)
    });
  }

  search(event): void {
    if (event.target.value) {
      this.displayData = deepCopy(this.oriData);
      this.displayData = this.tableService.search(event.target.value, this.displayData);
    } else {
      this.displayData = deepCopy(this.oriData);
    }
  }

  sort(sortAttribute) {
    this.displayData = this.tableService.sort(sortAttribute, this.displayData);
  }

  onCurrentPageDataChange($event: CourierOrderModel[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  onItemChecked(order: CourierOrderModel, checked: boolean): void {
    this.updateCheckedSet(order, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.selectedOrder = [];
    this.listOfCurrentPageData.forEach((order: CourierOrderModel) => this.updateCheckedSet(order, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(order: CourierOrderModel, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(order.orderNo);
      this.selectedOrder.push(order);
    } else {
      this.setOfCheckedId.delete(order.orderNo);
      let index: number = this.selectedOrder.indexOf(order);
      if (index >= 0) {
        this.selectedOrder.splice(index, 1);
      }
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((order) => this.setOfCheckedId.has(order.orderNo));
    this.indeterminate = this.listOfCurrentPageData.some(({orderId}) => this.setOfCheckedId.has(orderId)) && !this.checked;
    this.createRouteDisable = this.selectedOrder.length <= 0;
  }

  refreshOrderTable(): void {
    this.refreshTable.emit();

  }

  createRoute(): void {
    if (this.selectedOrder.length <= 0) {
      this.modal.promptWarningModal('Please select at least one order.', null, 'OK');
      return;
    }
    let vehicleType: string = this.selectedOrder[0].vehicleType;
    let sameVehicle: boolean = true;
    this.selectedOrder.forEach((value: UnhandleCourierOrderModel) => {
      if (vehicleType !== value.vehicleType) {
        sameVehicle = false;
      }
    })

    if (!sameVehicle) {
      this.modal.promptWarningModal('The vehicle type must be same.', null, 'OK');
      return;
    } else {
      this.createRouteVisible = true;
    }

  }

  cancelCreateRoute(): void {
    this.createRouteVisible = false;
  }

  submitCreateRoute(): void {
    this.orderRouteFrom.submitForm();
  }

  onCreateRoute(event): void {
    this.submitCreateRouteLoading = event;
  }

  successSubmitCreate(): void {
    this.cancelCreateRoute();
    this.resetAndRefresh();
  }

  successSubmitAdd(): void {
    this.cancelAddToRoute();
    this.resetAndRefresh();
  }

  resetAndRefresh(): void {
    this.refreshOrderTable();

    this.refreshRouteTable.emit();
    this.selectedOrder = [];
    this.setOfCheckedId.clear();
  }

  getAllReadyRoutes(vehicleType: string): void {
    this.routeListLoading = true;
    this.subHandlingService.subscribe(
      this.routeManagementService.findByRouteStatus(OrderRouteStatusConstant.READY, vehicleType).pipe(
        tap((response: IResponse<Array<{ routeId: string, vehicleType: string }>>) => {
          if (response.success) {
            this.routeIdList = response.data;
          }
          this.routeListLoading = false;
        })
      )
    )
  }

  onAddToRoute(): void {
    if (this.selectedOrder.length <= 0) {
      this.modal.promptWarningModal('Please select at least one order.', null, 'OK');
      return;
    }

    let vehicleType: string = this.selectedOrder[0].vehicleType;
    let sameVehicle: boolean = true;
    this.selectedOrder.forEach((value: UnhandleCourierOrderModel) => {
      if (vehicleType !== value.vehicleType) {
        sameVehicle = false;
      }
    })

    if (!sameVehicle) {
      this.modal.promptWarningModal('The vehicle type must be same.', null, 'OK');
      return;
    } else {
      this.getAllReadyRoutes(vehicleType);
      this.addToRouteVisible = true;
    }
  }

  cancelAddToRoute(): void {
    this.addToRouteVisible = false;
  }

  submitAddToRoute(): void {
    markFormGroupTouched(this.addToExistingRouteForm);
    getInvalidControls(this.addToExistingRouteForm);
    if (this.addToExistingRouteForm.invalid) {
      return;
    }

    let routeId: string = this.routeId.value;

    let orderRoute: OrderRouteRequestModel = {
      routeId: routeId,
      orderList: this.selectedOrder
    };

    this.submitAddToRouteLoading = true;
    this.subHandlingService.subscribe(
      this.routeManagementService.submitAddToRoute(orderRoute).pipe(
        tap((response: IResponse<string>) => {
          if (response.success) {
            this.modal.promptSuccessModal(response.data, null, 'OK');
            this.successSubmitAdd();
            this.addToExistingRouteForm.reset();
          } else {
            this.modal.promptErrorModal(response.message, null, 'OK');
          }
          this.submitAddToRouteLoading = false;
        })
      )
    )
  }

  get routeId(): AbstractControl {
    return this.addToExistingRouteForm.get('routeId');
  }
}

