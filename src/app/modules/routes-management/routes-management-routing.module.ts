import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoutesManagementPageComponent} from "./page/routes-management-page/routes-management-page.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RoutesManagementPageComponent,
        data: {
          breadcrumb: 'Route Management',
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutesManagementRoutingModule {
}
