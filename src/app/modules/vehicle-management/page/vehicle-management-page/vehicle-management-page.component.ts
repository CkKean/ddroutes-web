import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {VehicleService} from "../../service/vehicle.service";
import {VehicleModel} from "../../../shared/model/vehicle/vehicle.model";

@Component({
  templateUrl: './vehicle-management-page.component.html',
  styleUrls: ['./vehicle-management-page.component.scss'],
  providers: [SubHandlingService]
})
export class VehicleManagementPageComponent implements OnInit {

  vehicleList: VehicleModel[] = [];
  vehicleLoading: boolean = false;

  constructor(private vehicleService: VehicleService,
              private subHandlingService: SubHandlingService, private store: Store) {
  }

  ngOnInit(): void {
    this.getAllVehicle();
  }

  getAllVehicle(): void {
    this.vehicleLoading = true;

    this.subHandlingService.subscribe(
      this.vehicleService.findAll().pipe(
        tap((response: IResponse<VehicleModel[]>) => {
          if (response.success) {
            this.vehicleList = response.data;
          }
          this.vehicleLoading = false;
        })
      )
    );
  }
}
