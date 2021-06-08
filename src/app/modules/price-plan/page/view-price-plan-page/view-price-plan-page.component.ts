import {Component, OnInit} from '@angular/core';
import {RoutesConstant} from "../../../../constant/routes.constant";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {PricePlanModel} from "../../../shared/model/price-plan/price-plan.model";
import {PricePlanService} from "../../service/price-plan.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ActivatedRoute, Router} from "@angular/router";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {ModalService} from "../../../shared/services/modal.service";

@Component({
  templateUrl: './view-price-plan-page.component.html',
  styleUrls: ['./view-price-plan-page.component.scss'],
  providers: [SubHandlingService]
})
export class ViewPricePlanPageComponent implements OnInit {
  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  pricePlanIdParam: string;
  pricePlanData: PricePlanModel;
  pricePlanDataLoading: boolean = false;

  constructor(private pricePlanService: PricePlanService,
              private subHandlingService: SubHandlingService,
              private router: Router,
              private route: ActivatedRoute,
              private modal: ModalService) {
  }

  ngOnInit(): void {
    this.pricePlanDataLoading = true;
    if (this.route.snapshot.queryParams) {
      this.pricePlanIdParam = this.route.snapshot.queryParams['pricePlanId'];
      this.getPricePlanInfo();
    } else {
      this.modal.promptWarningModal('Price plan does not exist.', null, 'OK', RoutesConstant.PRICE_PLAN);
    }
  }

  getPricePlanInfo(): void {
    this.subHandlingService.subscribe(
      this.pricePlanService.findOne(this.pricePlanIdParam).pipe(
        tap((response: IResponse<PricePlanModel>) => {
          if (response.success) {
            this.pricePlanData = response.data;
            this.pricePlanDataLoading = false;
          } else {
            this.modal.promptWarningModal('Price plan does not exist.', null, 'OK', RoutesConstant.PRICE_PLAN);
          }
        })
      )
    )
  }

  editPricePlan(): void {
    this.router.navigate([RoutesConstant.PRICE_PLAN, RoutesConstant.UPDATE], {
      queryParamsHandling: 'preserve'
    });
  }
}
