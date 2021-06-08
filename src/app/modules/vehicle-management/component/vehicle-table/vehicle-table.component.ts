import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {deepCopy} from "../../../shared/utils/common.util";
import {TableService} from "../../../shared/services/table.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {SharedModalContentComponent} from "../../../shared/component/shared-modal-content/shared-modal-content.component";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {VehicleModel} from "../../../shared/model/vehicle/vehicle.model";
import {VehicleService} from "../../service/vehicle.service";
import {ModalService} from "../../../shared/services/modal.service";

@Component({
  selector: 'app-vehicle-table',
  templateUrl: './vehicle-table.component.html',
  styleUrls: ['./vehicle-table.component.scss'],
  providers: [SubHandlingService]
})
export class VehicleTableComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() set vehicleList(data: VehicleModel[]) {
    this.oriData = deepCopy(data);
    this.displayData = deepCopy(data);
  }

  @Input() vehicleLoading: boolean;
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();

  oriData: VehicleModel[] = [];
  displayData: VehicleModel[] = [];

  deleteLoading: boolean = false;

  tableHeader = [
    {title: 'No.', nzWidth: '60px', key: 'id'},
    {title: 'Plate No.', nzWidth: '150px', key: 'plateNo'},
    {title: 'Brand', nzWidth: '150px', key: 'brand'},
    {title: 'Model', nzWidth: '150px', key: 'model'},
    {title: 'Type', nzWidth: '150px', key: 'type'},
    {title: 'Color', nzWidth: '150px', key: 'color'},
    {title: 'Owner', nzWidth: '150px', key: 'owner'},
    {title: 'Actions', nzWidth: '120px'},
  ];

  constructor(private tableService: TableService,
              private vehicleService: VehicleService,
              private subHandlingService: SubHandlingService,
              private modal: ModalService, private nzModal: NzModalService,
              private router: Router,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
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

  onDeleteVehicle(data: VehicleModel): void {
    const modal: NzModalRef = this.nzModal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Confirm',
        subtitle: 'Are your sure you want to delete this vehicle record?',
        status: 'warning',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        nzOnOk: () => {
          modal.close();
          this.deleteVehicle(data.vehicleId);
        },
        nzOnCancel: () => modal.close()
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  deleteVehicle(vehicleId: string): void {
    this.deleteLoading = true;
    this.subHandlingService.subscribe(
      this.vehicleService.deleteVehicle(vehicleId).pipe(
        tap((response: IResponse<string>) => {
          if (response.success) {
            this.modal.promptSuccessModal(response.data, null, 'OK');
            this.refreshTable.emit();
          } else {
            this.modal.promptErrorModal(response.message, null, 'OK');
          }
          this.deleteLoading = false;
        })
      )
    )
  }

  navigateView(data: VehicleModel): void {
    this.router.navigate([RoutesConstant.VIEW], {relativeTo: this.route, queryParams: {plateNo: data.plateNo}});
  }

  navigateEdit(data: VehicleModel): void {
    this.router.navigate([RoutesConstant.UPDATE], {relativeTo: this.route, queryParams: {plateNo: data.plateNo}});
  }

  navigateCreate(): void {
    this.router.navigate([RoutesConstant.CREATE], {relativeTo: this.route});
  }

}

