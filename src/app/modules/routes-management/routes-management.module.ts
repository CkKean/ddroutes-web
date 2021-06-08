import {NgModule} from '@angular/core';

import {RoutesManagementRoutingModule} from './routes-management-routing.module';
import {RoutesManagementPageComponent} from './page/routes-management-page/routes-management-page.component';
import {SharedModule} from "../shared/shared.module";
import {RouteListTableComponent} from './component/route-list-table/route-list-table.component';
import {OrderListTableComponent} from './component/order-list-table/order-list-table.component';
import {WaypointsListTableComponent} from './component/waypoints-list-table/waypoints-list-table.component';
import {RouteMapComponent} from './component/route-map/route-map.component';
import {CreateRouteFormComponent} from './component/create-route-form/create-route-form.component';
import {EditRouteFormComponent} from './component/edit-route-form/edit-route-form.component';


@NgModule({
  declarations: [
    RoutesManagementPageComponent,
    RouteListTableComponent,
    OrderListTableComponent,
    WaypointsListTableComponent,
    RouteMapComponent,
    CreateRouteFormComponent,
    EditRouteFormComponent
  ],
  imports: [
    SharedModule,
    RoutesManagementRoutingModule
  ]
})
export class RoutesManagementModule {
}
