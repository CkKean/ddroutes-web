import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CompanyAddressPageComponent} from "./page/company-address-page/company-address-page.component";

const routes: Routes = [
  {
    path: '',
    component: CompanyAddressPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyAddressRoutingModule {
}
