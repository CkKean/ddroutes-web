import {Component, OnInit} from '@angular/core';
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {PricePlanService} from "../../service/price-plan.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {PricePlanModel} from "../../../shared/model/price-plan/price-plan.model";

@Component({
  templateUrl: './price-plan-page.component.html',
  styleUrls: ['./price-plan-page.component.scss'],
  providers: [SubHandlingService]
})
export class PricePlanPageComponent implements OnInit {

  pricePlanList: PricePlanModel;
  pricePlanLoading: boolean = false;

  constructor(private pricePlanService: PricePlanService, private subHandlingService: SubHandlingService) {
  }

  ngOnInit(): void {
    this.getAllPricePlan();
  }

  getAllPricePlan(): void {
    this.pricePlanLoading = true;
    this.subHandlingService.subscribe(
      this.pricePlanService.findAll().pipe(
        tap((response: IResponse<PricePlanModel>) => {
          this.pricePlanList = response.data;
          this.pricePlanLoading = false;

        })
      )
    )
  }

}
