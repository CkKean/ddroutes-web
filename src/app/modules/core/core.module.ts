import {NgModule} from '@angular/core';

import {CoreRoutingModule} from './core-routing.module';
import {HeaderComponent} from './layout/header/header.component';
import {PreLoginLayoutComponent} from './layout/prelogin-layout/prelogin-layout.component';
import {PostloginLayoutComponent} from './layout/postlogin-layout/postlogin-layout.component';
import {SharedModule} from "../shared/shared.module";
import {PublicLayoutComponent} from './layout/public-layout/public-layout.component';
import {FooterComponent} from './layout/footer/footer.component';
import {GeneralLayoutComponent} from './layout/general-layout/general-layout.component';
import {SidebarComponent} from './layout/sidebar/sidebar.component';
import {AuthGuard} from "./guard/auth.guard";
import {PublicFooterComponent} from './layout/public-footer/public-footer.component';
import {SessionGuard} from "./guard/session.guard";

@NgModule({
  declarations: [
    HeaderComponent,
    PreLoginLayoutComponent,
    PostloginLayoutComponent,
    PublicLayoutComponent,
    FooterComponent,
    GeneralLayoutComponent,
    SidebarComponent,
    PublicFooterComponent
  ],
  exports: [
    HeaderComponent
  ],
  imports: [
    SharedModule,
    CoreRoutingModule,
  ],
  providers: [AuthGuard, SessionGuard]
})
export class CoreModule {
}
