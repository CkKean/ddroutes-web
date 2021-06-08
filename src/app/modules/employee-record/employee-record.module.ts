import {NgModule} from '@angular/core';

import {EmployeeRecordRoutingModule} from './employee-record-routing.module';
import {EmployeeRecordPageComponent} from './page/employee-record-page/employee-record-page.component';
import {SharedModule} from "../shared/shared.module";
import {EmployeeTableComponent} from './component/employee-table/employee-table.component';
import {AddEmployeeFormComponent} from './component/add-employee-form/add-employee-form.component';
import {EditEmployeeFormComponent} from './component/edit-employee-form/edit-employee-form.component';
import {ViewEmployeeComponent} from './component/view-employee/view-employee.component';
import {RegisterModule} from "../register/register.module";


@NgModule({
  declarations: [EmployeeRecordPageComponent, EmployeeTableComponent, AddEmployeeFormComponent, EditEmployeeFormComponent, ViewEmployeeComponent],
  imports: [
    SharedModule,
    EmployeeRecordRoutingModule,
    RegisterModule
  ]
})
export class EmployeeRecordModule {
}
