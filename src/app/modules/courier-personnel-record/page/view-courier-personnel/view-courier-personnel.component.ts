import {Component, OnInit} from '@angular/core';
import {RoutesConstant} from "../../../../constant/routes.constant";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {VehicleModel} from "../../../shared/model/vehicle/vehicle.model";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {ModalService} from "../../../shared/services/modal.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {ApiRoutesConstant} from "../../../../constant/apiroutes.constant";
import {User} from "../../../shared/model/register/user.model";
import {EmployeeRecordService} from "../../../employee-record/service/employee-record.service";

@Component({
  templateUrl: './view-courier-personnel.component.html',
  styleUrls: ['./view-courier-personnel.component.scss'],
  providers: [SubHandlingService]
})
export class ViewCourierPersonnelComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  username: string;
  courierPersonnelInfo: User;
  courierPersonnelLoading: boolean = false;
  imageUrl: string;

  constructor(private employeeRecordService: EmployeeRecordService,
              private subHandlingService: SubHandlingService,
              private route: ActivatedRoute, private sanitizer: DomSanitizer,
              private modal: ModalService, private router: Router) {
  }

  ngOnInit(): void {
    this.courierPersonnelLoading = true;
    if (this.route.snapshot.queryParams) {
      this.username = this.route.snapshot.queryParams['username'];
      this.getPersonnelInformation();
    } else {
      this.modal.promptWarningModal('Courier personnel record does not exist.', null, 'OK', RoutesConstant.COURIER_PERSONNEL_RECORD);
    }
  }

  getPersonnelInformation(): void {
    this.subHandlingService.subscribe(
      this.employeeRecordService.findOne(this.username).pipe(
        tap((response: IResponse<VehicleModel>) => {
          if (response.success) {
            this.courierPersonnelInfo = response.data;
            if (this.courierPersonnelInfo.profileImg && this.courierPersonnelInfo.profileImgPath)
              this.imageUrl = ApiRoutesConstant.IMAGE_API + this.courierPersonnelInfo.profileImgPath + '/' + this.courierPersonnelInfo.profileImg;
            this.courierPersonnelLoading = false;
          }
        })
      )
    )
  }

  editPersonnel(): void {
    this.router.navigate([RoutesConstant.COURIER_PERSONNEL_RECORD, RoutesConstant.UPDATE], {
      queryParams: {username: this.username},
      queryParamsHandling: 'preserve'
    });
  }
}
