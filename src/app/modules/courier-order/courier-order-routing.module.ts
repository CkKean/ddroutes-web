import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CourierOrderPageComponent} from "./page/courier-order-page/courier-order-page.component";
import {RoutesConstant} from "../../constant/routes.constant";
import {CreateCourierOrderComponent} from "./page/create-courier-order/create-courier-order.component";
import {ViewCourierOrderComponent} from "./page/view-courier-order/view-courier-order.component";
import {UpdateCourierOrderComponent} from "./page/update-courier-order/update-courier-order.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CourierOrderPageComponent,
        data: {
          breadcrumb: 'Courier Order'
        }
      },
      {
        path: RoutesConstant.CREATE,
        component: CreateCourierOrderComponent,
        data: {
          breadcrumb: 'Create Courier Order'
        }
      },
      {
        path: RoutesConstant.VIEW,
        component: ViewCourierOrderComponent,
        data: {
          breadcrumb: 'View Courier Order'
        }
      },
      {
        path: RoutesConstant.UPDATE,
        component: UpdateCourierOrderComponent,
        data: {
          breadcrumb: 'Update Courier Order'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourierOrderRoutingModule {
}
