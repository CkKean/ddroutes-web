import {Component, OnInit} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalService} from "../../../shared/services/modal.service";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {CourierOrderModel} from "../../../shared/model/courier-order/courier-order.model";
import {CourierOrderRestService} from "../../service/courier-order.rest.service";
import {ListOfOrderStatus, OrderTypeConstant} from "../../../../constant/courier-order.constant";
import {ApiRoutesConstant} from "../../../../constant/apiroutes.constant";

@Component({
  templateUrl: './view-courier-order.component.html',
  styleUrls: ['./view-courier-order.component.scss'],
  providers: [SubHandlingService]
})
export class ViewCourierOrderComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  orderNo: string;
  orderInfo: CourierOrderModel;
  orderDetailLoading: boolean = false;
  orderTypeConstant = OrderTypeConstant;
  listOfOrderStatus = ListOfOrderStatus;
  imageUrl: string;
  pickupImageUrl: string;

  constructor(private courierOrderRestService: CourierOrderRestService,
              private subHandlingService: SubHandlingService,
              private route: ActivatedRoute,
              private modal: ModalService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.orderDetailLoading = true;
    if (this.route.snapshot.queryParams) {
      this.orderNo = this.route.snapshot.queryParams['orderNo'];
      this.getOrderInformation();
    } else {
      this.modal.promptWarningModal('Courier order does not exist.', null, 'OK', RoutesConstant.COURIER_ORDER);
    }
  }

  getOrderInformation(): void {
    this.subHandlingService.subscribe(
      this.courierOrderRestService.findByOrderNo(this.orderNo).pipe(
        tap((response: IResponse<CourierOrderModel>) => {
          if (response.success) {
            this.orderInfo = response.data;
            if (this.orderInfo.proofInfo !== null) {
              if (this.orderInfo.proofInfo?.signature && this.orderInfo.proofInfo?.signaturePath) {
                this.imageUrl = ApiRoutesConstant.IMAGE_API + this.orderInfo.proofInfo?.signaturePath + '/' + this.orderInfo.proofInfo?.signature;
              }
            }
            this.orderInfo.senderMobileNo = this.getMobileNo(this.orderInfo.senderMobileNo);
            this.orderInfo.recipientMobileNo = this.getMobileNo(this.orderInfo.recipientMobileNo);
            if (this.orderInfo.pickupProofInfo !== null) {
              this.pickupImageUrl = ApiRoutesConstant.IMAGE_API + this.orderInfo.pickupProofInfo?.signaturePath + '/' + this.orderInfo.pickupProofInfo?.signature;
            }
            this.orderDetailLoading = false;
          }
        })
      )
    )
  }

  editOrder(): void {
    this.router.navigate([RoutesConstant.COURIER_ORDER, RoutesConstant.UPDATE], {queryParams: {orderNo: this.orderNo}});
  }

  get imageApi(): string {
    return ApiRoutesConstant.IMAGE_API;
  }

  getMobileNo(mobileNo): string {
    return mobileNo.substring(0, 2) === '60' ? mobileNo : '60' + mobileNo;
  }
}
