import {NgModule} from '@angular/core';

import {RegisterRoutingModule} from './register-routing.module';
import {RegisterPageComponent} from './page/register-page/register-page.component';
import {SharedModule} from "../shared/shared.module";
import {AccountInformationFormComponent} from './component/account-information-form/account-information-form.component';
import {PersonalInformationFormComponent} from './component/personal-information-form/personal-information-form.component';


@NgModule({
  declarations: [RegisterPageComponent, AccountInformationFormComponent, PersonalInformationFormComponent],
  imports: [
    SharedModule,
    RegisterRoutingModule
  ],
  exports: [
    AccountInformationFormComponent,
    PersonalInformationFormComponent
  ]
})
export class RegisterModule {
}
