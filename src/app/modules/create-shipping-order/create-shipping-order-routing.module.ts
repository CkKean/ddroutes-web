import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateShippingOrderPageComponent} from "./page/create-shipping-order-page/create-shipping-order-page.component";

const routes: Routes = [
  {
    path: '',
    component: CreateShippingOrderPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateShippingOrderRoutingModule {
}
