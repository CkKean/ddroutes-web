import {Component, OnInit} from '@angular/core';
import {User} from "../../../shared/model/register/user.model";
import {EmployeeRecordService} from "../../../employee-record/service/employee-record.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";

@Component({
  templateUrl: './courier-personnel-page.component.html',
  styleUrls: ['./courier-personnel-page.component.scss'],
  providers: [SubHandlingService]
})
export class CourierPersonnelPageComponent implements OnInit {

  courierPersonnelList: User[] = [];
  courierPersonnelListLoading: boolean = false;

  constructor(private employeeRecordService: EmployeeRecordService,
              private subHandlingService: SubHandlingService) {
  }

  ngOnInit(): void {
    this.getAllCourierPersonnel();
  }

  getAllCourierPersonnel(): void {
    this.courierPersonnelListLoading = true;

    this.subHandlingService.subscribe(
      this.employeeRecordService.findAllCourierPersonnel().pipe(
        tap((response: IResponse<User[]>) => {
          if (response.success) {
            this.courierPersonnelList = response.data;
          }
          this.courierPersonnelListLoading = false;
        })
      )
    );
  }


}
