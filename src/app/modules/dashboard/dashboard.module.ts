import {NgModule} from '@angular/core';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardPageComponent} from './page/dashboard-page/dashboard-page.component';
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [DashboardPageComponent],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {
}
