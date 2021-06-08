import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {differenceInCalendarDays} from "date-fns";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {deepCopy} from "../../../shared/utils/common.util";
import {TableService} from "../../../shared/services/table.service";
import {RouteManagementService} from "../../service/route-management.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {distinctUntilChanged, tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {OrderRouteRequestModel} from "../../../shared/model/order-route/order-route-request.model";
import {ModalService} from "../../../shared/services/modal.service";
import {CompanyAddressModel} from "../../../shared/model/company-address/company-address.model";

@Component({
  selector: 'app-create-route-form',
  templateUrl: './create-route-form.component.html',
  styleUrls: ['./create-route-form.component.scss'],
  providers: [SubHandlingService]
})
export class CreateRouteFormComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() set selectedOrderList(data: CourierOrderModel[]) {
    this.oriData = deepCopy(data);
    this.displayData = deepCopy(data);
  }

  @Input() orderLoading: boolean;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() submitLoadingEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  oriData: CourierOrderModel[] = [];
  displayData: CourierOrderModel[] = [];

  tableHeader = [
    {title: 'Order No.', nzWidth: '100px'},
    {title: 'Tracking No.', nzWidth: '100px'},
    {title: 'Date', nzWidth: '100px', key: 'createdAt'},
    {title: 'Type', nzWidth: '100px', key: 'orderType'},
    {title: 'Status', nzWidth: '100px', key: 'orderStatus'},
    {title: 'Address', nzWidth: '200px', key: 'recipientAddress'},
  ];

  createRouteForm: FormGroup;
  dateFormat = 'dd/MM/yyyy';

  time: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);

  vehicleList: any;
  vehicleListLoading: boolean = false;

  staffList: any;
  staffListLoading: boolean = false;

  companyAddressList: any;
  companyAddressLoading: boolean = false;

  submitLoading: boolean = false;

  constructor(private tableService: TableService,
              private routeManagementService: RouteManagementService,
              private subHandlingService: SubHandlingService,
              private modal: ModalService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getAllVehiclePersonnel((new Date()).toLocaleString());
    this.getCompanyAddress();
  }

  initForm(): void {
    this.createRouteForm = new FormGroup({
      departurePoint: new FormControl(null, [Validators.required]),
      roundTrip: new FormControl(false),
      departureDate: new FormControl(new Date(), [Validators.required]),
      departureTime: new FormControl(null, [Validators.required]),
      personnel: new FormControl(null, [Validators.required]),
      vehicle: new FormControl(null, [Validators.required]),
    });
    this.dateSelected();
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

  dateSelected(): void {
    this.departureDate.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.getAllVehiclePersonnel(value);
    });
  }

  submitForm(): void {
    markFormGroupTouched(this.createRouteForm);
    getInvalidControls(this.createRouteForm);

    if (this.createRouteForm.invalid) {
      return;
    }
    let orderRoute: OrderRouteRequestModel = {...this.createRouteForm.getRawValue(), orderList: this.oriData};
    this.submitLoading = true;
    this.submitLoadingEvent.emit(true);
    this.subHandlingService.subscribe(
      this.routeManagementService.createOrderRoute(orderRoute).pipe(
        tap((response: IResponse<any>) => {
          if (response.success) {
            this.modal.promptSuccessModal(response.data, null, 'OK');
            this.closeModal.emit();
          } else {
            this.modal.promptErrorModal(response.message, null, 'OK');
          }
          this.submitLoading = false;
          this.submitLoadingEvent.emit(false);
        })
      )
    )
  }

  get departurePoint(): AbstractControl {
    return this.createRouteForm.get('departurePoint');
  }

  get roundTrip(): AbstractControl {
    return this.createRouteForm.get('roundTrip');
  }

  get departureDate(): AbstractControl {
    return this.createRouteForm.get('departureDate');
  }

  get departureTime(): AbstractControl {
    return this.createRouteForm.get('departureTime');
  }

  get personnel(): AbstractControl {
    return this.createRouteForm.get('personnel');
  }

  get vehicle(): AbstractControl {
    return this.createRouteForm.get('vehicle');
  }
}
