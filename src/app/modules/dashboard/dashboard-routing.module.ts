import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardPageComponent} from "./page/dashboard-page/dashboard-page.component";
import {RoutesConstant} from "../../constant/routes.constant";

const routes: Routes = [
  {
    path: RoutesConstant.DASHBOARD,
    component: DashboardPageComponent,
    data: {
      breadcrumb: 'Dashboard',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
