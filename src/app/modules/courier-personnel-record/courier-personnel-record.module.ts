import {NgModule} from '@angular/core';

import {CourierPersonnelRecordRoutingModule} from './courier-personnel-record-routing.module';
import {ViewCourierPersonnelComponent} from './page/view-courier-personnel/view-courier-personnel.component';
import {CourierPersonnelPageComponent} from './page/courier-personnel-page/courier-personnel-page.component';
import {EditCourierPersonnelComponent} from './page/edit-courier-personnel/edit-courier-personnel.component';
import {CourierPersonnelTableComponent} from './component/courier-personnel-table/courier-personnel-table.component';
import {CreateCourierPersonnelComponent} from './page/create-courier-personnel/create-courier-personnel.component';
import {SharedModule} from "../shared/shared.module";
import {RegisterModule} from "../register/register.module";


@NgModule({
  declarations: [
    ViewCourierPersonnelComponent,
    CourierPersonnelPageComponent,
    EditCourierPersonnelComponent,
    CourierPersonnelTableComponent,
    CreateCourierPersonnelComponent
  ],
  imports: [
    SharedModule,
    CourierPersonnelRecordRoutingModule,
    RegisterModule
  ]
})
export class CourierPersonnelRecordModule {
}
