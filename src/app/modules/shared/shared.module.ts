import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzStepsModule} from 'ng-zorro-antd/steps';
import {BaseComponent} from './component/base-component/base-component.component';
import {FormFieldComponent} from './component/form-field/form-field.component';
import {SubHeaderComponent} from './component/sub-header/sub-header.component';
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzModalModule} from "ng-zorro-antd/modal";
import {ConfirmationModal} from './component/confirmation-modal/confirmation-modal';
import {SharedModalContentComponent} from './component/shared-modal-content/shared-modal-content.component';
import {NzMessageModule} from "ng-zorro-antd/message";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzImageModule} from "ng-zorro-antd/image";
import {DateFormatPipe} from "./pipe/dateFormat.pipe";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {SessionnTimeoutModalComponent} from './component/sessionn-timeout-modal/sessionn-timeout-modal.component';
import {AccessDeniedModalComponent} from './component/access-denied-modal/access-denied-modal.component';
import {NzDividerModule} from "ng-zorro-antd/divider";
import {OrderFormFieldComponent} from './component/order-form-field/order-form-field.component';
import {FormDeclarationComponent} from './component/form-declaration/form-declaration.component';
import {NzTimelineModule} from "ng-zorro-antd/timeline";
import {NzTagModule} from "ng-zorro-antd/tag";
import {LabelTagComponent} from './component/label-tag/label-tag.component';
import {TraceOrderComponent} from './component/trace-order/trace-order.component';
import {SharedModalComponent} from './component/shared-modal/shared-modal.component';
import {InvoiceComponent} from './component/invoice/invoice.component';
import {ShipmentLabelComponent} from './component/shipment-label/shipment-label.component';
import {NzTimePickerModule} from "ng-zorro-antd/time-picker";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NzResultModule} from "ng-zorro-antd/result";
import {DeliveryRateComponent} from './component/delivery-rate/delivery-rate.component';
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NgxQRCodeModule} from "@techiediaries/ngx-qrcode";
import {NzBackTopModule} from "ng-zorro-antd/back-top";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {DateFormatWithoutSS} from "./pipe/dateFormatWithoutSS";

const imports = [
  CommonModule,
  NzGridModule,
  NzModalModule,
  NzButtonModule,
  NzTagModule,
  NzTimelineModule,
  NzStepsModule,
  NzDividerModule,
  NzTableModule,
  NzResultModule
];

const exportsModule = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  NzFormModule,
  NzInputModule,
  NzLayoutModule,
  NzMenuModule,
  NzGridModule,
  NzCarouselModule,
  NzCardModule,
  NzButtonModule,
  NzCheckboxModule,
  NzIconModule,
  NzStepsModule,
  NzSelectModule,
  NzDatePickerModule,
  NzRadioModule,
  NzModalModule,
  NzMessageModule,
  NzDropDownModule,
  NzToolTipModule,
  NzTableModule,
  NzAvatarModule,
  NzImageModule,
  NzSkeletonModule,
  NzUploadModule,
  NzDrawerModule,
  NzBreadCrumbModule,
  NzDividerModule,
  NzTimelineModule,
  NzTagModule,
  NzTimePickerModule,
  DragDropModule,
  NzResultModule,
  NzCollapseModule,
  NzBackTopModule,
  NzTabsModule
];

const exportsComponent = [
  BaseComponent,
  SubHeaderComponent,
  FormFieldComponent,
  ConfirmationModal,
  DateFormatPipe,
  DateFormatWithoutSS,
  AccessDeniedModalComponent,
  SessionnTimeoutModalComponent,
  OrderFormFieldComponent,
  FormDeclarationComponent,
  LabelTagComponent,
  TraceOrderComponent,
  SharedModalComponent,
  InvoiceComponent,
  ShipmentLabelComponent,
  DeliveryRateComponent
];

@NgModule({
  declarations: [
    BaseComponent,
    SubHeaderComponent,
    FormFieldComponent,
    ConfirmationModal,
    SharedModalContentComponent,
    DateFormatPipe,
    DateFormatWithoutSS,
    SessionnTimeoutModalComponent,
    AccessDeniedModalComponent,
    OrderFormFieldComponent,
    FormDeclarationComponent,
    LabelTagComponent,
    TraceOrderComponent,
    SharedModalComponent,
    InvoiceComponent,
    ShipmentLabelComponent,
    DeliveryRateComponent
  ],
  imports: [...imports, NgxQRCodeModule],
  exports: [...exportsModule, exportsComponent]
})
export class SharedModule {
}
