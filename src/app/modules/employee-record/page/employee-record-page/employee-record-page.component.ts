import {Component, OnInit} from '@angular/core';
import {EmployeeRecordService} from "../../service/employee-record.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {User} from "../../../shared/model/register/user.model";
import {Store} from "@ngxs/store";
import {EmployeePositionConstant} from "../../../../constant/employee-position.constant";

@Component({
  templateUrl: './employee-record-page.component.html',
  styleUrls: ['./employee-record-page.component.scss'],
  providers: [SubHandlingService]
})
export class EmployeeRecordPageComponent implements OnInit {

  staffList: User[] = [];
  staffLoading: boolean = false;

  constructor(private employeeRecordService: EmployeeRecordService,
              private subHandlingService: SubHandlingService, private store: Store) {
  }

  ngOnInit(): void {
    this.getAllStaff();
  }

  getAllStaff(): void {
    this.staffLoading = true;

    this.subHandlingService.subscribe(
      this.employeeRecordService.findStaffByPosition(EmployeePositionConstant.BO).pipe(
        tap((response: IResponse<User[]>) => {
          if (response.success) {
            this.staffList = response.data;
          }
          this.staffLoading = false;
        })
      )
    );
  }
}
