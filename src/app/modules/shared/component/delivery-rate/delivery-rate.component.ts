import {Component, OnInit} from '@angular/core';
import {PricePlanModel} from "../../model/price-plan/price-plan.model";
import {SubHandlingService} from "../../services/subscription-handling.service";
import {PricePlanService} from "../../../price-plan/service/price-plan.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../model/i-response";

@Component({
  selector: 'app-delivery-rate',
  templateUrl: './delivery-rate.component.html',
  styleUrls: ['./delivery-rate.component.scss'],
  providers: [SubHandlingService]
})
export class DeliveryRateComponent implements OnInit {

  pricePlanData: PricePlanModel[] = [];
  pricePlanDataLoading: boolean = false;
  tableHeader = [
    {title: 'No.', webWidth: '60px', mobileWidth: '60px', key: 'id', rowSpan: 2},
    {title: 'Vehicle Type', webWidth: '150px', mobileWidth: '180px', key: 'vehicleType', rowSpan: 2},
    {title: 'Distance', webWidth: '150px', mobileWidth: '120px', key: 'defaultDistance', rowSpan: 2},
    {title: 'Weight', webWidth: '150px', mobileWidth: '120px', key: 'defaultWeight', rowSpan: 2},
    {title: 'Price', webWidth: '150px', mobileWidth: '120px', key: 'defaultPricing', rowSpan: 2},
    {title: 'Subsequent Charges', webWidth: '300px', mobileWidth: '180px', columnSpan: 2, rowSpan: 1},
  ];

  constructor(private subHandlingService: SubHandlingService, private pricePlanService: PricePlanService) {
  }

  ngOnInit(): void {
    this.getPricePlan();
  }

  getPricePlan(): void {
    this.pricePlanDataLoading = true;
    this.subHandlingService.subscribe(
      this.pricePlanService.findAll().pipe(
        tap((response: IResponse<PricePlanModel[]>) => {
          this.pricePlanData = response.data;
          this.pricePlanDataLoading = false;
        })
      )
    )
  }
}
