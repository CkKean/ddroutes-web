import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {deepCopy} from "../../../shared/utils/common.util";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {TableService} from "../../../shared/services/table.service";
import {RouteManagementService} from "../../service/route-management.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ModalService} from "../../../shared/services/modal.service";
import {differenceInCalendarDays} from "date-fns";
import {distinctUntilChanged, tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {OrderRouteRequestModel} from "../../../shared/model/order-route/order-route-request.model";
import {OrderRouteModel} from "../../../shared/model/order-route/order-route.model";
import {CompanyAddressModel} from "../../../shared/model/company-address/company-address.model";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {SharedModalContentComponent} from "../../../shared/component/shared-modal-content/shared-modal-content.component";

@Component({
  selector: 'app-edit-route-form',
  templateUrl: './edit-route-form.component.html',
  styleUrls: ['./edit-route-form.component.scss'],
  providers: [SubHandlingService]
})
export class EditRouteFormComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() set selectedOrderRoute(data: OrderRouteModel) {
    if (data) {
      this.orderRouteData = data;
      this.oriData = deepCopy(data.displayOrderList);
      this.displayData = deepCopy(data.displayOrderList);
      this.departureAddress = data.departureAddress;
    }

  }

  @Input() orderRouteLoading: boolean;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteOrder: EventEmitter<string> = new EventEmitter<string>();

  orderRouteData: OrderRouteModel;
  oriData: CourierOrderModel[] = [];
  displayData: CourierOrderModel[] = [];
  departureAddress: CompanyAddressModel;

  tableHeader = [
    {title: 'Order No.', nzWidth: '100px', key: 'orderNo'},
    {title: 'Tracking No.', nzWidth: '100px', key: 'trackingNo'},
    {title: 'Date', nzWidth: '100px', key: 'createdAt'},
    {title: 'Type', nzWidth: '100px', key: 'displayOrderType'},
    {title: 'Status', nzWidth: '100px', key: 'displayOrderStatus'},
    {title: 'Address', nzWidth: '200px', key: 'recipientAddress'},
  ];

  editRouteForm: FormGroup;
  dateFormat = 'dd/MM/yyyy';

  time: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);

  vehicleList: any;
  vehicleListLoading: boolean = false;

  staffList: any;
  staffListLoading: boolean = false;

  companyAddressLoading: boolean = false;
  companyAddressList: any;

  submitLoading: boolean = false;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  listOfCurrentPageData: CourierOrderModel[] = [];
  selectedDeleteOrders: CourierOrderModel[] = [];
  deletedOrders: CourierOrderModel[] = [];
  removeDisable: boolean = true;

  constructor(private tableService: TableService,
              private routeManagementService: RouteManagementService,
              private subHandlingService: SubHandlingService,
              private modal: ModalService, private nzModal: NzModalService,
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getAllVehiclePersonnel((new Date(this.orderRouteData.departureDate)).toLocaleString());
    this.getCompanyAddress();
  }

  initForm(): void {
    this.editRouteForm = new FormGroup({
      routeId: new FormControl({value: this.orderRouteData.routeId, disabled: true}, [Validators.required]),
      departurePoint: new FormControl(this.orderRouteData.departurePoint, [Validators.required]),
      roundTrip: new FormControl(this.orderRouteData.roundTrip),
      departureDate: new FormControl(new Date(this.orderRouteData.departureDate), [Validators.required]),
      departureTime: new FormControl(new Date(this.orderRouteData.departureTime), [Validators.required]),
      personnel: new FormControl(this.orderRouteData.personnel, [Validators.required]),
      vehicle: new FormControl(this.orderRouteData.vehicleId, [Validators.required]),
    });

  }

  sort(sortAttribute): void {
    this.displayData = this.tableService.sort(sortAttribute, this.displayData);
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };

  getAllVehiclePersonnel(date: string): void {
    this.vehicleListLoading = true;
    this.staffListLoading = true;
    this.subHandlingService.subscribe(
      this.routeManagementService.findVehiclePersonnel(this.oriData[0].vehicleType, new Date(date).toLocaleString(), this.oriData[0].routeId).pipe(
        tap((response: IResponse<any>) => {
          if (response.success) {
            this.vehicleList = response.data.vehicleList;
            this.staffList = response.data.personnelList;
            this.vehicleListLoading = false;
            this.staffListLoading = false;
          }
        })
      )
    )
  }

  getCompanyAddress(): void {
    this.companyAddressLoading = true;
    this.subHandlingService.subscribe(
      this.routeManagementService.findCompanyAddress().pipe(
        tap((response: IResponse<CompanyAddressModel[]>) => {
          if (response.success) {
            this.companyAddressList = response.data;
            this.companyAddressLoading = false;
          }
        })
      )
    )
  }

  submitForm(): void {
    markFormGroupTouched(this.editRouteForm);
    getInvalidControls(this.editRouteForm);

    if (this.editRouteForm.invalid) {
      return;
    }

    if (this.checkOrderList()) {
      this.submitUpdate();
    }

  }

  submitUpdate(): void {
    markFormGroupTouched(this.editRouteForm);
    getInvalidControls(this.editRouteForm);
    if (this.editRouteForm.invalid) {
      return;
    }
    let orderRoute: OrderRouteRequestModel = {
      ...this.editRouteForm.getRawValue(),
      orderList: this.displayData,
      orderDeletedList: this.deletedOrders
    };

    this.submitLoading = true;
    this.subHandlingService.subscribe(
      this.routeManagementService.updateOrderRoute(orderRoute).pipe(
        tap((response: IResponse<any>) => {
          if (response.success) {
            this.modal.promptSuccessModal(response.data, null, 'OK');
            this.editRouteForm.reset();
            this.closeModal.emit();
          } else {
            this.modal.promptErrorModal(response.message, null, 'OK');
          }
          this.submitLoading = false;
        })
      )
    )
  }

  checkOrderList(): boolean {
    if ((this.displayData.length === 0)) {
      const modal: NzModalRef = this.nzModal.create({
        nzContent: SharedModalContentComponent,
        nzMaskClosable: false,
        nzClassName: 'confirmation-modal',
        nzClosable: true,
        nzComponentParams: {
          title: 'Confirm',
          subtitle: 'All orders have been removed. The order route will be deleted. Are you sure?',
          status: 'warning',
          cancelText: 'Cancel',
          confirmText: 'Confirm',
          nzOnOk: () => {
            this.deleteOrder.emit(this.routeId.value);
            modal.close();
            this.closeModal.emit();
          },
          nzOnCancel: () => modal.close()
        },
        nzCentered: true,
        nzFooter: null,
      });
      return false;
    }
    return true;
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
    this.listOfCurrentPageData.forEach((order: CourierOrderModel) => this.updateCheckedSet(order, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(order: CourierOrderModel, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(order.orderNo);
      this.selectedDeleteOrders.push(order);
    } else {
      this.setOfCheckedId.delete(order.orderNo);
      let index: number = this.selectedDeleteOrders.indexOf(order);
      if (index >= 0) {
        this.selectedDeleteOrders.splice(index, 1);
      }
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((order) => this.setOfCheckedId.has(order.orderNo));
    this.indeterminate = this.listOfCurrentPageData.some(({orderId}) => this.setOfCheckedId.has(orderId)) && !this.checked;
    if (this.selectedDeleteOrders.length > 0) {
      this.removeDisable = false;
    } else {
      this.removeDisable = true;
    }
  }

  removeOrder(): void {
    for (let deleteOrder of this.selectedDeleteOrders) {
      this.displayData = this.displayData.filter((order) => order.orderNo !== deleteOrder.orderNo);
    }
    this.deletedOrders.push(...this.selectedDeleteOrders);
    this.selectedDeleteOrders = [];
    this.removeDisable = true;
  }

  dateSelected(): void {
    this.departureDate.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.personnel.patchValue(null);
      this.getAllVehiclePersonnel(value);
    });
  }

  get routeId(): AbstractControl {
    return this.editRouteForm.get('routeId');
  }

  get departurePoint(): AbstractControl {
    return this.editRouteForm.get('departurePoint');
  }

  get roundTrip(): AbstractControl {
    return this.editRouteForm.get('roundTrip');
  }

  get departureDate(): AbstractControl {
    return this.editRouteForm.get('departureDate');
  }

  get departureTime(): AbstractControl {
    return this.editRouteForm.get('departureTime');
  }

  get personnel(): AbstractControl {
    return this.editRouteForm.get('personnel');
  }

  get vehicle(): AbstractControl {
    return this.editRouteForm.get('vehicle');
  }
}
