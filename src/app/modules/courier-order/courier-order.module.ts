import {NgModule} from '@angular/core';

import {CourierOrderRoutingModule} from './courier-order-routing.module';
import {CourierOrderPageComponent} from './page/courier-order-page/courier-order-page.component';
import {CourierOrderTableComponent} from './component/courier-order-table/courier-order-table.component';
import {CreateCourierOrderComponent} from './page/create-courier-order/create-courier-order.component';
import {ViewCourierOrderComponent} from './page/view-courier-order/view-courier-order.component';
import {UpdateCourierOrderComponent} from './page/update-courier-order/update-courier-order.component';
import {SharedModule} from "../shared/shared.module";


@NgModule({
    declarations: [CourierOrderPageComponent, CourierOrderTableComponent, CreateCourierOrderComponent, ViewCourierOrderComponent, UpdateCourierOrderComponent],
    exports: [
        CourierOrderTableComponent
    ],
    imports: [
        SharedModule,
        CourierOrderRoutingModule
    ]
})
export class CourierOrderModule {
}
