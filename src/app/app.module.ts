import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {DatePipe, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from "./modules/core/core.module";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {NgxsLoggerPluginModule} from "@ngxs/logger-plugin";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import {NgxsStoragePluginModule, StorageOption} from "@ngxs/storage-plugin";
import {NgxsSelectSnapshotModule} from "@ngxs-labs/select-snapshot";
import {NgxsFormPluginModule} from "@ngxs/form-plugin";
import {NgxsModule} from "@ngxs/store";
import {AccessTokenInterceptor} from "./modules/core/interceptor/AccessTokenInterceptor";
import {HandleUnauthorizedInterceptor} from "./modules/core/interceptor/HandleUnauthorizedInterceptor";
import {AppState} from "./modules/core/state/app.state";
import {ModalState} from "./modules/core/state/modal.state";
import {SharedModule} from "./modules/shared/shared.module";
import {AuthState} from "./modules/core/state/auth.state";
import {ShippingOrderState} from "./modules/create-shipping-order/state/shipping-order.state";
import {NgxQRCodeModule} from "@techiediaries/ngx-qrcode";


registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    NgxsLoggerPluginModule.forRoot({logger: console, collapsed: false, disabled: environment.production}),
    NgxsReduxDevtoolsPluginModule.forRoot({disabled: environment.production}),
    NgxsStoragePluginModule.forRoot({
      storage: StorageOption.SessionStorage,
    }),
    NgxsSelectSnapshotModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    NgxsModule.forRoot([
        AppState,
        AuthState,
        ModalState,
        ShippingOrderState
      ],
      {
        developmentMode: !environment.production,
      }
    ),
    ServiceWorkerModule.register('bo-sw.js', {enabled: environment.production}),
    NgxQRCodeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AccessTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HandleUnauthorizedInterceptor,
      multi: true
    },
    {
      provide: NZ_I18N,
      useValue: en_US
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
