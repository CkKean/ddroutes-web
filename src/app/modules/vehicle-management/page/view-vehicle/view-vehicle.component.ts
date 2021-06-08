import {Component, OnInit} from '@angular/core';
import {VehicleService} from "../../service/vehicle.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ActivatedRoute, Router} from "@angular/router";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {VehicleModel} from "../../../shared/model/vehicle/vehicle.model";
import {ModalService} from "../../../shared/services/modal.service";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {DomSanitizer} from "@angular/platform-browser";
import {ApiRoutesConstant} from "../../../../constant/apiroutes.constant";

@Component({
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.scss'],
  providers: [SubHandlingService]
})
export class ViewVehicleComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  plateNo: string;
  vehicleInfo: VehicleModel;
  vehicleLoading: boolean = false;
  imageUrl: string;

  constructor(private vehicleService: VehicleService,
              private subHandlingService: SubHandlingService,
              private route: ActivatedRoute, private sanitizer: DomSanitizer,
              private modal: ModalService, private router: Router) {
  }

  ngOnInit(): void {
    this.vehicleLoading = true;
    if (this.route.snapshot.queryParams) {
      this.plateNo = this.route.snapshot.queryParams['plateNo'];
      this.getVehicleInformation();
    } else {
      this.modal.promptWarningModal('Vehicle does not exist.', null, 'OK', RoutesConstant.VEHICLE_MANAGEMENT);
    }
  }

  getVehicleInformation(): void {
    this.subHandlingService.subscribe(
      this.vehicleService.findOne(this.plateNo).pipe(
        tap((response: IResponse<VehicleModel>) => {
          if (response.success) {
            this.vehicleInfo = response.data;
            if (this.vehicleInfo.photoPath && this.vehicleInfo.photo)
              this.imageUrl = ApiRoutesConstant.IMAGE_API + this.vehicleInfo.photoPath + '/' + this.vehicleInfo.photo;
            this.vehicleLoading = false;
          }
        })
      )
    )
  }

  editVehicle(): void {
    this.router.navigate([RoutesConstant.VEHICLE_MANAGEMENT, RoutesConstant.UPDATE], {
      queryParams: {plateNo: this.plateNo},
      queryParamsHandling: 'preserve'
    });
  }
}
