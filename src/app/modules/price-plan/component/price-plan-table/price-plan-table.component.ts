import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {deepCopy} from "../../../shared/utils/common.util";
import {TableService} from "../../../shared/services/table.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ModalService} from "../../../shared/services/modal.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {PricePlanModel} from "../../../shared/model/price-plan/price-plan.model";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {PricePlanService} from "../../service/price-plan.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {SharedModalContentComponent} from "../../../shared/component/shared-modal-content/shared-modal-content.component";

@Component({
  selector: 'app-price-plan-table',
  templateUrl: './price-plan-table.component.html',
  styleUrls: ['./price-plan-table.component.scss'],
  providers: [SubHandlingService]
})
export class PricePlanTableComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() set pricePlanList(data: PricePlanModel[]) {
    this.oriData = deepCopy(data);
    this.displayData = deepCopy(data);
  }

  @Input() pricePlanLoading: boolean;
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();

  oriData: PricePlanModel[] = [];
  displayData: PricePlanModel[] = [];

  tableHeader = [
    {title: 'No.', webWidth: '30px', mobileWidth: '60px', key: 'id', rowSpan: 2},
    {title: 'Vehicle Type', webWidth: '150px', mobileWidth: '180px', key: 'vehicleType', rowSpan: 2},
    {title: 'Distance', webWidth: '150px', mobileWidth: '120px', key: 'defaultDistance', rowSpan: 2},
    {title: 'Weight', webWidth: '150px', mobileWidth: '120px', key: 'defaultWeight', rowSpan: 2},
    {title: 'Price', webWidth: '150px', mobileWidth: '120px', key: 'defaultPricing', rowSpan: 2},
    {title: 'Subsequent Charges', webWidth: '300px', mobileWidth: '180px', columnSpan: 2, rowSpan: 1},
    {title: 'Actions', webWidth: '100px', mobileWidth: '250px', rowSpan: 2},
  ];

  constructor(private tableService: TableService,
              private pricePlanService: PricePlanService,
              private subHandlingService: SubHandlingService,
              private modal: ModalService,
              private nzModal: NzModalService,
              private router: Router,
              private route: ActivatedRoute) {
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

  navigateCreate(): void {
    this.router.navigate([RoutesConstant.CREATE], {relativeTo: this.route});
  }

  navigateView(data: PricePlanModel): void {
    this.router.navigate([RoutesConstant.VIEW], {relativeTo: this.route, queryParams: {pricePlanId: data.pricePlanId}});
  }

  navigateEdit(data: PricePlanModel): void {
    this.router.navigate([RoutesConstant.UPDATE], {relativeTo: this.route, queryParams: {pricePlanId: data.pricePlanId}});
  }

  onDeleteVehicle(data: PricePlanModel): void {
    const modal: NzModalRef = this.nzModal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Confirm',
        subtitle: 'Are your sure you want to delete this price plan record?',
        status: 'warning',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        nzOnOk: () => {
          modal.close();
          this.deletePricePlan(data.pricePlanId);
        },
        nzOnCancel: () => modal.close()
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  deletePricePlan(pricePlanId: string): void {
    this.subHandlingService.subscribe(
      this.pricePlanService.deletePricePlan(pricePlanId).pipe(
        tap((response: IResponse<string>) => {
          if (response.success) {
            this.modal.promptSuccessModal('Price plan record have been deleted.', null, 'OK');
            this.refreshTable.emit();
          } else {
            this.modal.promptErrorModal(response.message, null, 'OK');
          }
        })
      )
    )
  }
}
