import {Component, OnInit} from '@angular/core';
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {EmployeeRecordService} from "../../service/employee-record.service";
import {ActivatedRoute, Router} from "@angular/router";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {User} from "../../../shared/model/register/user.model";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {Select} from "@ngxs/store";
import {ApiRoutesConstant} from "../../../../constant/apiroutes.constant";
import {ModalService} from "../../../shared/services/modal.service";

@Component({
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss'],
  providers: [SubHandlingService]
})
export class ViewEmployeeComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  username: string;
  employeeDetailLoading: boolean = true;
  employeeDetail: User;
  imageUrl: string;

  constructor(private subHandlingService: SubHandlingService,
              private employeeRecordService: EmployeeRecordService,
              private modal: ModalService, private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.employeeDetailLoading = true;
    if (this.route.snapshot.queryParams) {
      this.username = this.route.snapshot.queryParams['username'];
      this.getEmployeeDetail();
    } else {
      this.modal.promptWarningModal('Employee record does not exist.', null, 'OK', RoutesConstant.EMPLOYEE_RECORD);
    }
  }

  getEmployeeDetail(): void {
    this.employeeDetailLoading = true;
    this.subHandlingService.subscribe(
      this.employeeRecordService.findOne(this.username).pipe(
        tap((response: IResponse<User>) => {
          if (response.success) {
            this.employeeDetail = response.data;
            if (this.employeeDetail.profileImgPath && this.employeeDetail.profileImg)
              this.imageUrl = ApiRoutesConstant.IMAGE_API + this.employeeDetail.profileImgPath + '/' + this.employeeDetail.profileImg;
            this.employeeDetailLoading = false;
          }
        })
      )
    )
  }

  editEmployee(): void {
    this.router.navigate([RoutesConstant.EMPLOYEE_RECORD, RoutesConstant.UPDATE], {queryParamsHandling: "preserve"});
  }

}
