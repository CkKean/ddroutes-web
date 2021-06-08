import {NgModule} from '@angular/core';

import {ShippingOrderRoutingModule} from './shipping-order-routing.module';
import {ShippingOrderPageComponent} from './page/shipping-order-page/shipping-order-page.component';
import {SharedModule} from "../shared/shared.module";
import { ShippingOrderDetailComponent } from './component/shipping-order-detail/shipping-order-detail.component';


@NgModule({
  declarations: [ShippingOrderPageComponent, ShippingOrderDetailComponent],
  imports: [
    SharedModule,
    ShippingOrderRoutingModule
  ]
})
export class ShippingOrderModule {
}
