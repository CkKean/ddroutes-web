import {Component, OnInit} from '@angular/core';
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {RouteReportService} from "../../service/route-report.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {RouteReportModel} from "../../../shared/model/route-report/route-report.model";

@Component({
  templateUrl: './route-report-page.component.html',
  styleUrls: ['./route-report-page.component.scss'],
  providers: [SubHandlingService]

})
export class RouteReportPageComponent implements OnInit {


  routeReportData: RouteReportModel[];
  routeReportLoading: boolean = false;

  constructor(private routeReportService: RouteReportService,
              private subHandlingService: SubHandlingService) {
  }

  ngOnInit(): void {
    this.getAllOrderRoute();
  }

  getAllOrderRoute(): void {
    this.routeReportLoading = true;
    this.subHandlingService.subscribe(
      this.routeReportService.findAll().pipe(
        tap((response: IResponse<RouteReportModel[]>) => {
          if (response.success) {
            this.routeReportData = response.data;
            this.routeReportLoading = false;
          }
        })
      )
    )
  }
}
