import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PricePlanPageComponent} from "./page/price-plan-page/price-plan-page.component";
import {AddPricePlanPageComponent} from "./page/add-price-plan-page/add-price-plan-page.component";
import {RoutesConstant} from "../../constant/routes.constant";
import {EditPricePlanPageComponent} from "./page/edit-price-plan-page/edit-price-plan-page.component";
import {ViewPricePlanPageComponent} from "./page/view-price-plan-page/view-price-plan-page.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PricePlanPageComponent,
        data: {
          breadcrumb: 'Price Plan'
        }
      },
      {
        path: RoutesConstant.CREATE,
        component: AddPricePlanPageComponent,
        data: {
          breadcrumb: 'Add Price Plan'
        }
      },
      {
        path: RoutesConstant.UPDATE,
        component: EditPricePlanPageComponent,
        data: {
          breadcrumb: 'Update Price Plan'
        }
      },
      {
        path: RoutesConstant.VIEW,
        component: ViewPricePlanPageComponent,
        data: {
          breadcrumb: 'View Price Plan'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricePlanRoutingModule {
}
