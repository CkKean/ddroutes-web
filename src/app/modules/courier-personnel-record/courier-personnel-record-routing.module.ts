import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoutesConstant} from "../../constant/routes.constant";
import {ViewCourierPersonnelComponent} from "./page/view-courier-personnel/view-courier-personnel.component";
import {EditCourierPersonnelComponent} from "./page/edit-courier-personnel/edit-courier-personnel.component";
import {CreateCourierPersonnelComponent} from './page/create-courier-personnel/create-courier-personnel.component';
import {CourierPersonnelPageComponent} from "./page/courier-personnel-page/courier-personnel-page.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CourierPersonnelPageComponent,
        data: {
          breadcrumb: 'Courier Personnel Record'
        }
      },
      {
        path: RoutesConstant.VIEW,
        component: ViewCourierPersonnelComponent,
        data: {
          breadcrumb: RoutesConstant.VIEW,
        }
      },
      {
        path: RoutesConstant.CREATE,
        component: CreateCourierPersonnelComponent,
        data: {
          breadcrumb: RoutesConstant.CREATE,
        }
      },
      {
        path: RoutesConstant.UPDATE,
        component: EditCourierPersonnelComponent,
        data: {
          breadcrumb: RoutesConstant.UPDATE,
        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourierPersonnelRecordRoutingModule {
}
