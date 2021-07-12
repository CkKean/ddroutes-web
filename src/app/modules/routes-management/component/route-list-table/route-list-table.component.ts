import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {deepCopy} from "../../../shared/utils/common.util";
import {TableService} from "../../../shared/services/table.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ModalService} from "../../../shared/services/modal.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {SharedModalContentComponent} from "../../../shared/component/shared-modal-content/shared-modal-content.component";
import {OrderRouteModel} from "../../../shared/model/order-route/order-route.model";
import {RouteManagementService} from "../../service/route-management.service";
import {IResponse} from "../../../shared/model/i-response";
import {tap} from "rxjs/operators";
import {EditRouteFormComponent} from "../edit-route-form/edit-route-form.component";
import {OrderRouteStatusConstant} from "../../../../constant/order-route-status.constant";

@Component({
  selector: 'app-route-list-table',
  templateUrl: './route-list-table.component.html',
  styleUrls: ['./route-list-table.component.scss'],
  providers: [SubHandlingService]
})
export class RouteListTableComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() set routeList(data: OrderRouteModel[]) {
    if (data) {
      this.oriData = deepCopy(data);
      this.displayData = data;
    }
    if (this.selectedRouteId) {
      this.selectedOrderRoute = data.filter((route: OrderRouteModel) => route.routeId === this.selectedRouteId)[0];
      this.selectedOrderRouteEvent.emit(this.selectedOrderRoute);
    }

  }

  @Input() routeListLoading: boolean;
  @Output() refreshTable: EventEmitter<string> = new EventEmitter<string>();
  @Output() refreshOrderList: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteAndRefreshEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() selectedOrderRouteEvent: EventEmitter<OrderRouteModel> = new EventEmitter<OrderRouteModel>();
  @Output() orderRoute: EventEmitter<OrderRouteModel> = new EventEmitter<OrderRouteModel>();
  oriData: OrderRouteModel[] = [];
  displayData: OrderRouteModel[] = [];

  deleteLoading: boolean = false;
  deleteDisable: boolean = true;

  editDisable: boolean = true;
  editLoading: boolean = false;
  editVisible: boolean = false;

  selectedRouteId: string;
  selectedOrderRoute: OrderRouteModel;
  offset: any;

  @ViewChild(EditRouteFormComponent) orderRouteFrom: EditRouteFormComponent;

  tableHeader = [
    {title: '#', nzWidth: '40px'},
    {title: 'Route ID', nzWidth: '100px'},
    {title: 'Departure Date', nzWidth: '100px', key: 'departureDate'},
    {title: 'Personnel', nzWidth: '100px', key: 'personnel'},
    {title: 'Vehicle', nzWidth: '100px', key: 'vehicleInfo'},
    {title: 'Est. Distance, KM', nzWidth: '100px', key: 'totalDistance'},
    {title: 'Est. Duration', nzWidth: '100px', key: 'timeNeeded'},
    {title: 'Completed', nzWidth: '100px', key: 'itemWeight'},
    {title: 'Status', nzWidth: '100px', key: 'status'},
  ];

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
    this.offset = new Date().getTimezoneOffset();
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

  onDeleteOrder(): void {
    if (this.selectedOrderRoute.status === OrderRouteStatusConstant.IN_PROGRESS || this.selectedOrderRoute.status === OrderRouteStatusConstant.COMPLETED) {
      this.modal.promptWarningModal('Order route is ' + this.selectedOrderRoute.status + '. Unable to delete.', null, 'OK');
    } else {
      const modal: NzModalRef = this.nzModal.create({
        nzContent: SharedModalContentComponent,
        nzMaskClosable: false,
        nzClassName: 'confirmation-modal',
        nzClosable: true,
        nzComponentParams: {
          title: 'Confirm',
          subtitle: 'Are your sure you want to delete this order route record?',
          status: 'warning',
          cancelText: 'Cancel',
          confirmText: 'Confirm',
          nzOnOk: () => {
            this.deleteOrder(this.selectedRouteId);
            modal.close();
          },
          nzOnCancel: () => modal.close()
        },
        nzCentered: true,
        nzFooter: null,
      });
    }

  }

  deleteOrder(routeId): void {
    this.deleteLoading = true;
    this.subHandlingService.subscribe(
      this.routeManagementService.deleteOrderRoute(routeId).pipe(
        tap((response: IResponse<string>) => {
          if (response.success) {
            this.modal.promptSuccessModal(response.data, null, 'OK');
            this.refreshTable.emit();
            this.deleteAndRefreshEvent.emit();
            this.selectedOrderRouteEvent.emit(null);
          } else {
            this.modal.promptErrorModal(response.message, null, 'OK');
          }
          this.deleteLoading = false;
        })
      )
    )
  }

  selectedRoute(data: OrderRouteModel): void {
    this.selectedRouteId = data.routeId;
    this.selectedOrderRoute = data;
    this.deleteDisable = false;
    this.editDisable = false;
    this.selectedOrderRouteEvent.emit(data);
  }

  editOrderRoute(): void {
    if (this.selectedOrderRoute.status === OrderRouteStatusConstant.IN_PROGRESS || this.selectedOrderRoute.status === OrderRouteStatusConstant.COMPLETED) {
      this.modal.promptWarningModal('Order route is ' + this.selectedOrderRoute.status + '. Unable to edit.', null, 'OK');
    } else {
      this.editVisible = true;
    }
  }

  cancelEdit(): void {
    this.editVisible = false;
  }

  submitOrderRouteForm(): void {
    this.orderRouteFrom.submitForm();
  }

  successUpdate(): void {
    this.refreshOrderList.emit();
    this.refreshTable.emit(this.selectedRouteId);
    this.cancelEdit();
  }

  refreshRouteTable(): void {
    this.refreshTable.emit();
  }
}
