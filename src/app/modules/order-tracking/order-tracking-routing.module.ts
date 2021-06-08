import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OrderTrackingPageComponent} from "./page/order-tracking-page/order-tracking-page.component";

const routes: Routes = [
  {
    path: '',
    component: OrderTrackingPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderTrackingRoutingModule {
}
