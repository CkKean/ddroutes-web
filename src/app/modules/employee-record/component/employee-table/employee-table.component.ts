import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableService} from "../../../shared/services/table.service";
import {User} from "../../../shared/model/register/user.model";
import {deepCopy} from "../../../shared/utils/common.util";
import {EmployeeRecordService} from "../../service/employee-record.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {SharedModalContentComponent} from "../../../shared/component/shared-modal-content/shared-modal-content.component";
import {ActivatedRoute, Router} from "@angular/router";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {ModalService} from "../../../shared/services/modal.service";
import {ApiRoutesConstant} from "../../../../constant/apiroutes.constant";

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss'],
  providers: [SubHandlingService]
})
export class EmployeeTableComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() set staffList(data: User[]) {
    this.oriData = deepCopy(data);
    this.displayData = deepCopy(data);
  }

  @Input() staffLoading: boolean;
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();

  oriData: User[] = [];
  displayData: User[] = [];

  deleteLoading: boolean = false;

  tableHeader = [
    {title: 'No.', nzWidth: '60px'},
    {title: 'Full Name', nzWidth: '180px', key: 'fullName'},
    {title: 'Username', nzWidth: '150px', key: 'username'},
    {title: 'Mobile No.', nzWidth: '150px', key: 'mobileNo'},
    {title: 'Position', nzWidth: '120px', key: 'position'},
    {title: 'State', nzWidth: '120px', key: 'state'},
    {title: 'Start Date', nzWidth: '120px', key: 'startDate'},
    {title: 'Action', nzWidth: '120px'},
  ]


  constructor(private tableService: TableService,
              private employeeRecordService: EmployeeRecordService,
              private subHandlingService: SubHandlingService,
              private modal: ModalService, private nzModal: NzModalService,
              private router: Router,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
  }

  search(event): void {
    if (event.target.value) {
      this.displayData = deepCopy(this.oriData);
      this.displayData = this.tableService.search(event.target.value, this.displayData);
    } else {
      this.displayData = deepCopy(this.oriData);
    }
  }

  sort(sortAttribute) {
    console.log(sortAttribute);
    this.displayData = this.tableService.sort(sortAttribute, this.displayData);
  }

  onDeleteStaff(username: string): void {
    const modal: NzModalRef = this.nzModal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Confirm',
        subtitle: 'Are your sure you want to delete this employee record?',
        status: 'warning',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        nzOnOk: () => {
          modal.close();
          this.deleteStaff(username);
        },
        nzOnCancel: () => modal.close()
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  deleteStaff(username: string): void {
    this.deleteLoading = true;
    this.subHandlingService.subscribe(
      this.employeeRecordService.delete(username).pipe(
        tap((response: IResponse<string>) => {
          if (response.success) {
            this.modal.promptSuccessModal(response.data, null, 'OK');
            this.refreshTable.emit();
          } else {
            this.modal.promptSuccessModal(response.message, null, 'OK');
          }
          this.deleteLoading = false;
        })
      )
    )
  }

  navigateView(data: User): void {
    this.router.navigate([RoutesConstant.VIEW], {relativeTo: this.route, queryParams: {username: data.username}});
  }

  navigateEdit(data: User): void {
    this.router.navigate([RoutesConstant.UPDATE], {relativeTo: this.route, queryParams: {username: data.username}});
  }

  navigateCreate(): void {
    this.router.navigate([RoutesConstant.CREATE], {relativeTo: this.route});
  }

  getProfileImg(path: string, img: string): string {
    return ApiRoutesConstant.IMAGE_API + path + '/' + img;
  }
}
