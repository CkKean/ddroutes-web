import {NgModule} from '@angular/core';

import {TermsConditionsRoutingModule} from './terms-conditions-routing.module';
import {TermsConditionsPageComponent} from './page/terms-conditions-page/terms-conditions-page.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [TermsConditionsPageComponent],
  imports: [
    SharedModule,
    TermsConditionsRoutingModule
  ]
})
export class TermsConditionsModule {
}
