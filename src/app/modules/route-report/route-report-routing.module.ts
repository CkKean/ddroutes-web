import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RouteReportPageComponent} from "./page/route-report-page/route-report-page.component";
import {RoutesConstant} from "../../constant/routes.constant";
import {EditRouteReportModalComponent} from "./component/edit-route-report-modal/edit-route-report-modal.component";
import {ViewRouteReportPageComponent} from "./page/view-route-report-page/view-route-report-page.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RouteReportPageComponent,
        data: {
          breadcrumb: 'Order Route Report'
        }
      },
      {
        path: RoutesConstant.UPDATE,
        component: EditRouteReportModalComponent,
        data: {
          breadcrumb: 'Update Order Route Report'
        }
      },
      {
        path: RoutesConstant.VIEW,
        component: ViewRouteReportPageComponent,
        data: {
          breadcrumb: 'View Order Route Report'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteReportRoutingModule {
}
