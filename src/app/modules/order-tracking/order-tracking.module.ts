import {NgModule} from '@angular/core';

import {OrderTrackingRoutingModule} from './order-tracking-routing.module';
import {OrderTrackingPageComponent} from './page/order-tracking-page/order-tracking-page.component';
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [OrderTrackingPageComponent],
  imports: [
    SharedModule,
    OrderTrackingRoutingModule
  ]
})
export class OrderTrackingModule {
}
