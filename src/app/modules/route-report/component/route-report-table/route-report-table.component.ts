import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {deepCopy} from "../../../shared/utils/common.util";
import {TableService} from "../../../shared/services/table.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ModalService} from "../../../shared/services/modal.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {RouteReportService} from "../../service/route-report.service";
import {RouteReportModel} from "../../../shared/model/route-report/route-report.model";
import {ListOfOrderStatus} from "../../../../constant/courier-order.constant";

@Component({
  selector: 'app-route-report-table',
  templateUrl: './route-report-table.component.html',
  styleUrls: ['./route-report-table.component.scss'],
  providers: [SubHandlingService]
})
export class RouteReportTableComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() set routeReportList(data: RouteReportModel[]) {
    this.oriData = deepCopy(data);
    this.displayData = deepCopy(data);
  }

  @Input() orderLoading: boolean;
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();

  oriData: RouteReportModel[] = [];
  displayData: RouteReportModel[] = [];
  routeReportData: RouteReportModel;
  editVisible: boolean = false;

  tableHeader = [
    {title: 'No.', nzWidth: '60px'},
    {title: 'Report No.', nzWidth: '150px'},
    {title: 'Status', nzWidth: '150px', key: 'status'},
    {title: 'Personnel', nzWidth: '150px', key: 'personnel'},
    {title: 'Est. Distance.', nzWidth: '150px', key: 'calculatedDistanceTravel'},
    {title: 'Est. Petrol Cost', nzWidth: '150px', key: 'calculatedPetrolFees'},
    {title: 'Actual Petrol Cost', nzWidth: '180px', key: 'actualPetrolFees'},
    {title: 'Created At', nzWidth: '150px', key: 'createdAt'},
    {title: 'Actions', nzWidth: '120px'},
  ];

  constructor(private tableService: TableService,
              private routeReportService: RouteReportService,
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

  navigateView(routeReportId: string): void {
    this.router.navigate([RoutesConstant.VIEW], {
      relativeTo: this.route,
      queryParams: {routeReportId: routeReportId}
    });
  }

  navigateEdit(data: RouteReportModel): void {
    if (data.orderRoute.status !== ListOfOrderStatus.COMPLETED) {
      this.modal.promptWarningModal("The route report still have not completed yet.", null, 'OK');
      return;
    }

    this.routeReportData = data;
    this.editVisible = true;
  }

  cancelEdit(): void {
    this.editVisible = false;
  }
}
