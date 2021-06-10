import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VehicleManagementPageComponent} from "./page/vehicle-management-page/vehicle-management-page.component";
import {AddVehicleComponent} from "./page/add-vehicle/add-vehicle.component";
import {RoutesConstant} from "../../constant/routes.constant";
import {ViewVehicleComponent} from "./page/view-vehicle/view-vehicle.component";
import {UpdateVehicleComponent} from "./page/update-vehicle/update-vehicle.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: VehicleManagementPageComponent,
        data: {
          breadcrumb: 'Vehicle Record',
        }
      },
      {
        path: RoutesConstant.CREATE,
        component: AddVehicleComponent,
        data: {
          breadcrumb: "Create Vehicle Record",
        }
      },
      {
        path: RoutesConstant.VIEW,
        component: ViewVehicleComponent,
        data: {
          breadcrumb: "View Vehicle Record",
        }
      },
      {
        path: RoutesConstant.UPDATE,
        component: UpdateVehicleComponent,
        data: {
          breadcrumb: "Update Vehicle Record",
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleManagementRoutingModule {
}
