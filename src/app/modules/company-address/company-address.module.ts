import {NgModule} from '@angular/core';
import {CompanyAddressRoutingModule} from './company-address-routing.module';
import {CompanyAddressPageComponent} from './page/company-address-page/company-address-page.component';
import {CompanyAddressFormComponent} from './component/company-address-form/company-address-form.component';
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [CompanyAddressPageComponent, CompanyAddressFormComponent],
  imports: [
    SharedModule,
    CompanyAddressRoutingModule
  ]
})
export class CompanyAddressModule {
}
