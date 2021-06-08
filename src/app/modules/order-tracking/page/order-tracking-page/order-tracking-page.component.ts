import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {OrderStatusModel} from "../../../shared/model/courier-order/order-status.model";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {TrackingService} from "../../service/tracking.service";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";

@Component({
  templateUrl: './order-tracking-page.component.html',
  styleUrls: ['./order-tracking-page.component.scss'],
  providers: [SubHandlingService]
})
export class OrderTrackingPageComponent implements OnInit {
  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  trackingForm: FormGroup;
  trackingDataVisible: boolean = false;

  orderDetailLoading: boolean;
  orderStatus: OrderStatusModel;
  step: number;
  errorMessage: string;

  constructor(private subHandlingService: SubHandlingService, private trackingService: TrackingService) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.trackingForm = new FormGroup({
      trackingOrderNo: new FormControl(null, [Validators.required])
    });
  }

  submit(): void {
    markFormGroupTouched(this.trackingForm);
    getInvalidControls(this.trackingForm);

    if (this.trackingForm.invalid) {
      return;
    }

    this.orderDetailLoading = true;
    this.errorMessage = null;
    this.subHandlingService.subscribe(
      this.trackingService.trackOrder(this.trackingOrderNo.value).pipe(
        tap((response: IResponse<CourierOrderModel>) => {
          this.trackingDataVisible = true;
          if (response.success) {
            this.orderStatus = response.data;
            if (response.data.orderStatus === 'Pending') {
              this.step = 1;
            } else if (response.data.orderStatus === 'In Progress') {
              this.step = 2;
            } else if (response.data.orderStatus === 'Delivered') {
              this.step = 3;
            } else if (response.data.orderStatus === 'Received') {
              this.step = 4;
            } else {
              this.step = 0;
            }
          } else {
            this.errorMessage = response.message;
          }
          this.orderDetailLoading = false;
        })
      )
    )
  }

  get trackingOrderNo(): AbstractControl {
    return this.trackingForm.get('trackingOrderNo');
  }
}
