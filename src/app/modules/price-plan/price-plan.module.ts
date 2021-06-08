import {NgModule} from '@angular/core';

import {PricePlanRoutingModule} from './price-plan-routing.module';
import {PricePlanPageComponent} from './page/price-plan-page/price-plan-page.component';
import {PricePlanTableComponent} from './component/price-plan-table/price-plan-table.component';
import {SharedModule} from "../shared/shared.module";
import {AddPricePlanPageComponent} from './page/add-price-plan-page/add-price-plan-page.component';
import {EditPricePlanPageComponent} from './page/edit-price-plan-page/edit-price-plan-page.component';
import { ViewPricePlanPageComponent } from './page/view-price-plan-page/view-price-plan-page.component';


@NgModule({
  declarations: [PricePlanPageComponent, PricePlanTableComponent, AddPricePlanPageComponent, EditPricePlanPageComponent, ViewPricePlanPageComponent],
  imports: [
    SharedModule,
    PricePlanRoutingModule
  ]
})
export class PricePlanModule {
}
