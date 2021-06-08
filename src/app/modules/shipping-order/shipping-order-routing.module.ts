import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShippingOrderPageComponent} from "./page/shipping-order-page/shipping-order-page.component";
import {RoutesConstant} from "../../constant/routes.constant";
import {ShippingOrderSummaryComponent} from "./page/shipping-order-summary/shipping-order-summary.component";

const routes: Routes = [
  {
    path: '',
    component: ShippingOrderPageComponent,
  },
  {
    path: RoutesConstant.SUMMARY,
    component: ShippingOrderSummaryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingOrderRoutingModule {
}
