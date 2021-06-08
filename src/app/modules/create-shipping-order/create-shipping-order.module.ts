import {NgModule} from '@angular/core';

import {CreateShippingOrderPageComponent} from './page/create-shipping-order-page/create-shipping-order-page.component';
import {ShippingOrderFormComponent} from './component/shipping-order-form/shipping-order-form.component';
import {SharedModule} from "../shared/shared.module";
import {PaymentComponent} from "./component/payment/payment.component";
import {ShippingOrderOverviewComponent} from "./component/shipping-order-overview/shipping-order-overview.component";
import {DeliveryRateTableComponent} from './component/delivery-rate-table/delivery-rate-table.component';
import {ShippingOrderSummaryComponent} from '../shipping-order/page/shipping-order-summary/shipping-order-summary.component';
import {CreateShippingOrderRoutingModule} from "./create-shipping-order-routing.module";


@NgModule({
  declarations: [CreateShippingOrderPageComponent,
    ShippingOrderFormComponent,
    ShippingOrderOverviewComponent,
    PaymentComponent,
    DeliveryRateTableComponent,
    ShippingOrderSummaryComponent
  ],
  imports: [
    SharedModule,
    CreateShippingOrderRoutingModule
  ]
})
export class CreateShippingOrderModule {

}
