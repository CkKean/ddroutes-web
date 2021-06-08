import {NgModule} from '@angular/core';

import {LoginRoutingModule} from './login-routing.module';
import {LoginComponent} from './page/login/login.component';
import {SharedModule} from "../shared/shared.module";
import { LoginFormComponent } from './component/login-form/login-form.component';


@NgModule({
  declarations: [LoginComponent, LoginFormComponent],
  imports: [
    SharedModule,
    LoginRoutingModule
  ]
})
export class LoginModule {
}
