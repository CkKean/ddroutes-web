import {NgModule} from '@angular/core';

import {RouteReportRoutingModule} from './route-report-routing.module';
import {RouteReportPageComponent} from './page/route-report-page/route-report-page.component';
import {RouteReportTableComponent} from './component/route-report-table/route-report-table.component';
import {SharedModule} from "../shared/shared.module";
import { EditRouteReportModalComponent } from './component/edit-route-report-modal/edit-route-report-modal.component';
import { ViewRouteReportPageComponent } from './page/view-route-report-page/view-route-report-page.component';


@NgModule({
  declarations: [RouteReportPageComponent, RouteReportTableComponent, EditRouteReportModalComponent, ViewRouteReportPageComponent],
  imports: [
    SharedModule,
    RouteReportRoutingModule
  ]
})
export class RouteReportModule {
}
