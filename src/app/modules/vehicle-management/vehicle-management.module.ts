import {NgModule} from '@angular/core';

import {VehicleManagementRoutingModule} from './vehicle-management-routing.module';
import {VehicleManagementPageComponent} from './page/vehicle-management-page/vehicle-management-page.component';
import {SharedModule} from "../shared/shared.module";
import { VehicleTableComponent } from './component/vehicle-table/vehicle-table.component';
import { AddVehicleComponent } from './page/add-vehicle/add-vehicle.component';
import { ViewVehicleComponent } from './page/view-vehicle/view-vehicle.component';
import { UpdateVehicleComponent } from './page/update-vehicle/update-vehicle.component';


@NgModule({
  declarations: [VehicleManagementPageComponent, VehicleTableComponent, AddVehicleComponent, ViewVehicleComponent, UpdateVehicleComponent],
  imports: [
    SharedModule,
    VehicleManagementRoutingModule
  ]
})
export class VehicleManagementModule {
}
