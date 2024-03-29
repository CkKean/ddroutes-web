import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmployeeRecordPageComponent} from "./page/employee-record-page/employee-record-page.component";
import {RoutesConstant} from "../../constant/routes.constant";
import {ViewEmployeeComponent} from "./component/view-employee/view-employee.component";
import {EditEmployeeFormComponent} from "./component/edit-employee-form/edit-employee-form.component";
import {AddEmployeeFormComponent} from "./component/add-employee-form/add-employee-form.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: EmployeeRecordPageComponent,
        data: {
          breadcrumb: 'Employee Record'
        }
      },
      {
        path: RoutesConstant.VIEW,
        component: ViewEmployeeComponent,
        data: {
          breadcrumb: "View Employee Record",
        }
      },
      {
        path: RoutesConstant.CREATE,
        component: AddEmployeeFormComponent,
        data: {
          breadcrumb: "Create Employee Record",
        }
      },
      {
        path: RoutesConstant.UPDATE,
        component: EditEmployeeFormComponent,
        data: {
          breadcrumb: "Update Employee Record",
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRecordRoutingModule {
}
