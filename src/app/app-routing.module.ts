import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PreLoginLayoutComponent} from "./modules/core/layout/prelogin-layout/prelogin-layout.component";
import {RoutesConstant} from "./constant/routes.constant";
import {GeneralLayoutComponent} from "./modules/core/layout/general-layout/general-layout.component";
import {PublicLayoutComponent} from "./modules/core/layout/public-layout/public-layout.component";
import {PostloginLayoutComponent} from "./modules/core/layout/postlogin-layout/postlogin-layout.component";
import {AuthGuard} from "./modules/core/guard/auth.guard";
import {SessionGuard} from "./modules/core/guard/session.guard";

const routes: Routes = [
  {
    path: '',
    canActivate: [SessionGuard],
    component: PreLoginLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/landing/landing.module').then(m => m.LandingModule)
      },
    ]
  },
  {
    path: '',
    component: PostloginLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: {
          breadcrumb: 'Dashboard',
        }
      },
      {
        path: RoutesConstant.ROUTES_MANAGEMENT,
        loadChildren: () => import('./modules/routes-management/routes-management.module').then(m => m.RoutesManagementModule),
        data: {
          breadcrumb: 'Routes Management',
        }
      },
      {
        path: RoutesConstant.VEHICLE_MANAGEMENT,
        loadChildren: () => import('./modules/vehicle-management/vehicle-management.module').then(m => m.VehicleManagementModule),
        data: {
          breadcrumb: 'Vehicle Management',
        }
      },
      {
        path: RoutesConstant.ORDER_ROUTE_REPORT,
        loadChildren: () => import('./modules/route-report/route-report.module').then(m => m.RouteReportModule),
        data: {
          breadcrumb: 'Order Route Report',
        }
      },
      {
        path: RoutesConstant.PRICE_PLAN,
        loadChildren: () => import('./modules/price-plan/price-plan.module').then(m => m.PricePlanModule),
        data: {
          breadcrumb: 'Price Plan',
        }
      },
      {
        path: RoutesConstant.EMPLOYEE_RECORD,
        loadChildren: () => import('./modules/employee-record/employee-record.module').then(m => m.EmployeeRecordModule),
        data: {
          breadcrumb: 'Employee Record',
        }
      },
      {
        path: RoutesConstant.COURIER_PERSONNEL_RECORD,
        loadChildren: () => import('./modules/courier-personnel-record/courier-personnel-record.module').then(m => m.CourierPersonnelRecordModule),
        data: {
          breadcrumb: 'Courier Personnel Record',
        }
      },
      {
        path: RoutesConstant.COURIER_ORDER,
        loadChildren: () => import('./modules/courier-order/courier-order.module').then(m => m.CourierOrderModule),
        data: {
          breadcrumb: 'Courier Order',
        }
      },
      {
        path: RoutesConstant.COMPANY_ADDRESS_MANAGEMENT,
        loadChildren: () => import('./modules/company-address/company-address.module').then(m => m.CompanyAddressModule),
        data: {
          breadcrumb: 'Company Address Management',
        }
      },
    ]
  },
  {
    path: '',
    component: PublicLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: RoutesConstant.CREATE_SHIPPING_ORDER,
        loadChildren: () => import('./modules/create-shipping-order/create-shipping-order.module').then(m => m.CreateShippingOrderModule),
        data: {
          breadcrumb: 'Create Shipping Order',
        }
      },
      {
        path: RoutesConstant.SHIPPING_ORDER,
        loadChildren: () => import('./modules/shipping-order/shipping-order.module').then(m => m.ShippingOrderModule),
        data: {
          breadcrumb: 'Shipping Order',
        }
      },
    ]
  },
  {
    path: RoutesConstant.LOGIN,
    component: GeneralLayoutComponent,
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
  },
  {
    path: RoutesConstant.REGISTER,
    component: PublicLayoutComponent,
    loadChildren: () => import('./modules/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: RoutesConstant.TERM_CONDITION,
    component: PublicLayoutComponent,
    loadChildren: () => import('./modules/terms-conditions/terms-conditions.module').then(m => m.TermsConditionsModule)
  },
  {
    path: RoutesConstant.TRACKING,
    canActivate: [SessionGuard],
    component: PublicLayoutComponent,
    loadChildren: () => import('./modules/order-tracking/order-tracking.module').then(m => m.OrderTrackingModule),
    data: {
      breadcrumb: 'Tracking',
    }
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
