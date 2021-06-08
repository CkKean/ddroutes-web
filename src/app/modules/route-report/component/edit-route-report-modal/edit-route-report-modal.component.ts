import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {RouteReportService} from "../../service/route-report.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ModalService} from "../../../shared/services/modal.service";
import {RouteReportModel} from "../../../shared/model/route-report/route-report.model";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {NzMessageService} from "ng-zorro-antd/message";
import {ApiRoutesConstant} from "../../../../constant/apiroutes.constant";

@Component({
  selector: 'app-edit-route-report-page',
  templateUrl: './edit-route-report-modal.component.html',
  styleUrls: ['./edit-route-report-modal.component.scss'],
  providers: [SubHandlingService]
})
export class EditRouteReportModalComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  @Input() visible: boolean = false;

  @Input() set routeReportData(data: RouteReportModel) {
    if (data) {
      this.reportData = data;
      if (this.reportData.statementPath && this.reportData.statement)
        this.imageSrc = ApiRoutesConstant.IMAGE_API + this.reportData.statementPath + '/' + this.reportData.statement;
    }
  }

  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();

  reportData: RouteReportModel;

  get routeReportData(): RouteReportModel {
    return this.reportData;
  }

  dateFormat = 'dd/MM/yyyy';
  currentDate = new Date();
  routeReportForm: FormGroup;
  updateLoading: boolean = false;

  imageSrc: any;
  uploadedFile: File[];
  uploadedFileName: string;
  uploadedFileValid: boolean = true;
  uploadedFileErrorMsg: string;


  constructor(private routeReportService: RouteReportService,
              private msg: NzMessageService,
              private subHandlingService: SubHandlingService,
              private modal: ModalService) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.routeReportForm = new FormGroup({
      actualPetrolFees: new FormControl(this.routeReportData.actualPetrolFees, [Validators.required]),
      latestPetrolPrice: new FormControl(this.routeReportData.latestPetrolPrice, [Validators.required]),
      date: new FormControl(this.currentDate, [Validators.required]),
      statement: new FormControl(null)
    });
  }

  cancel(): void {
    this.onCancel.emit();
  }

  updateRouteReport(): void {

    markFormGroupTouched(this.routeReportForm);
    getInvalidControls(this.routeReportForm);
    if (this.routeReportForm.invalid) {
      return;
    }

    let routeReport: RouteReportModel = {
      routeId: this.routeReportData.routeId,
      vehicle_id: this.routeReportData.orderRoute.vehicleId,
      statement: this.statement.value,
      actualPetrolFees: this.actualPetrolFees.value,
      latestPetrolPrice: this.latestPetrolPrice.value,
      routeReportId: this.routeReportData.routeReportId
    };

    let formData = new FormData();

    if (this.imageSrc && this.uploadedFile && this.uploadedFileValid) {
      let fileType = this.uploadedFile[0].type.split('/')[1];
      formData.append("file", this.uploadedFile[0], ('Report_' + this.routeReportData.orderRoute?.personnelInfo.fullName + '.' + fileType));
    }
    formData.append("routeReport", JSON.stringify(routeReport));

    this.updateLoading = true;
    this.subHandlingService.subscribe(
      this.routeReportService.updateRouteReport(formData).pipe(
        tap((response: IResponse<any>) => {
          if (response.success) {
            this.modal.promptSuccessModal(response.data, null, 'OK', RoutesConstant.ORDER_ROUTE_REPORT);
            this.cancel();
            this.refreshTable.emit();
          } else {
            this.modal.promptErrorModal(response.message, null, 'OK');
          }
          this.updateLoading = false;
        })
      )
    )
  }

  fileChange(event): void {
    this.uploadedFile = event.target.files;

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const isJpgOrPngOrJpeg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJpgOrPngOrJpeg) {
        this.msg.error('You can only upload JPG, JPEG and PNG format!');
        this.uploadedFileValid = false;
        this.uploadedFileErrorMsg = 'You can only upload JPG, JPEG and PNG format! Otherwise, no file will be uploaded.';
        this.uploadedFile = null;
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        this.uploadedFileValid = false;
        this.uploadedFileErrorMsg = 'Image must smaller than 2MB!';
        this.uploadedFile = null;

        return;
      }
      this.uploadedFileValid = true;
      this.uploadedFileName = file.name;
      this.statement.patchValue(this.uploadedFile);

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.uploadedFile = null;
    this.uploadedFileName = null;
    this.imageSrc = null;
    this.uploadedFileValid = true;
  }

  get actualPetrolFees(): AbstractControl {
    return this.routeReportForm.get('actualPetrolFees');
  }

  get statement(): AbstractControl {
    return this.routeReportForm.get('statement');
  }

  get date(): AbstractControl {
    return this.routeReportForm.get('date');
  }

  get latestPetrolPrice(): AbstractControl {
    return this.routeReportForm.get('latestPetrolPrice');
  }
}
