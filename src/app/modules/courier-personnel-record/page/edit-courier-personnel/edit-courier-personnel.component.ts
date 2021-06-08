import {Component, OnInit} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {User} from "../../../shared/model/register/user.model";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {UtilityModel} from "../../../shared/model/utility.model";
import {EmployeePositionConstant} from "../../../../constant/employee-position.constant";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {UtilityService} from "../../../shared/services/utility.service";
import {ModalService} from "../../../shared/services/modal.service";
import {EmployeeRecordService} from "../../../employee-record/service/employee-record.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {postCodeValidator} from "../../../shared/validators/customvalidator.validator";
import {deepCopy} from "../../../shared/utils/common.util";
import {takeUntil, tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {ApiRoutesConstant} from "../../../../constant/apiroutes.constant";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {differenceInCalendarDays} from "date-fns";
import {BaseComponent} from "../../../shared/component/base-component/base-component.component";

@Component({
  templateUrl: './edit-courier-personnel.component.html',
  styleUrls: ['./edit-courier-personnel.component.scss'],
  providers: [SubHandlingService]
})
export class EditCourierPersonnelComponent extends BaseComponent implements OnInit {


  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  username: string;
  personnelDetail: User;
  personnelDetailLoading: boolean = true;
  personnelForm: FormGroup;
  oriPersonnelForm: FormGroup;
  stateList: UtilityModel[];
  dateFormat = 'dd/MM/yyyy';
  submitDisabled: boolean = true;
  submitLoading: boolean = false;

  imageSrc: any;
  uploadedFile: File[];
  uploadedFileName: string;
  uploadedFileValid: boolean = true;
  uploadedFileErrorMsg: string;

  employeePositionType = EmployeePositionConstant.EMPLOYEE_POSITION_ARR;

  constructor(private subHandlingService: SubHandlingService,
              private utilityService: UtilityService,
              private modal: ModalService,
              private employeeRecordService: EmployeeRecordService,
              private router: Router, private route: ActivatedRoute,
              private msg: NzMessageService) {
    super();
  }

  ngOnInit(): void {
    this.personnelDetailLoading = true;
    if (this.route.snapshot.queryParams) {
      this.username = this.route.snapshot.queryParams['username'];
      this.getEmployeeDetail();
      this.stateList = this.utilityService.getState();
    } else {
      this.modal.promptWarningModal('Courier Personnel record does not exist.', null, 'OK', RoutesConstant.EMPLOYEE_RECORD);
    }
  }

  initForm(): void {
    this.personnelForm = new FormGroup({
      mobileNo: new FormControl(this.personnelDetail.mobileNo, Validators.required),
      address: new FormControl(this.personnelDetail.address, Validators.required),
      city: new FormControl(this.personnelDetail.city, Validators.required),
      postcode: new FormControl(this.personnelDetail.postcode, [Validators.required, postCodeValidator]),
      state: new FormControl(this.personnelDetail.state, Validators.required),
      startDate: new FormControl(new Date(this.personnelDetail.startDate), Validators.required),
      position: new FormControl(this.personnelDetail.position, Validators.required),
      profileImg: new FormControl(this.personnelDetail.profileImg),
    });
    this.oriPersonnelForm = deepCopy(this.personnelForm);
    this.subscribeForm();
  }

  getEmployeeDetail(): void {
    this.personnelDetailLoading = true;
    this.subHandlingService.subscribe(
      this.employeeRecordService.findOne(this.username).pipe(
        tap((response: IResponse<User>) => {
          if (response.success) {
            this.personnelDetail = response.data;
            this.checkImageExist();
            this.initForm();
            this.personnelDetailLoading = false;
          }
        })
      )
    )
  }

  checkImageExist(): void {
    if (this.personnelDetail.profileImgPath && this.personnelDetail.profileImg) {
      this.imageSrc = ApiRoutesConstant.IMAGE_API + this.personnelDetail.profileImgPath + '/' + this.personnelDetail.profileImg;
      this.uploadedFileValid = true;
      this.uploadedFileName = this.personnelDetail.profileImg;
    }
  }

  subscribeForm(): void {
    this.personnelForm.valueChanges.pipe(takeUntil(this.onDestroySubject)).subscribe(value => {
      if (JSON.stringify(value) === JSON.stringify(this.oriPersonnelForm.getRawValue())) {
        this.submitDisabled = true;
      } else {
        this.submitDisabled = false;
      }
    });
  }

  cancelForm(): void {
    this.personnelForm.reset();
    this.personnelForm = deepCopy(this.oriPersonnelForm);
    this.removeFile();
    this.checkImageExist();

    this.submitDisabled = true;
    this.subscribeForm();

  }

  submitForm(): void {
    markFormGroupTouched(this.personnelForm);
    getInvalidControls(this.personnelForm);
    if (this.personnelForm.invalid || !this.uploadedFileValid) {
      return;
    }

    let employee: User = this.personnelForm.getRawValue();
    employee.userType = this.personnelDetail.userType;
    employee.username = this.personnelDetail.username;

    let formData = new FormData();

    if (this.imageSrc && this.uploadedFile) {
      let fileType = this.uploadedFile[0].type.split('/')[1];
      formData.append("file", this.uploadedFile[0], ('CP_' + this.personnelDetail.fullName + '.' + fileType));
    }
    formData.append("user", JSON.stringify(employee));


    if (employee && this.personnelForm.valid) {
      this.submitLoading = true;
      this.subHandlingService.subscribe(
        this.employeeRecordService.update(formData).pipe(
          tap((response: IResponse<string>) => {
            if (response.success) {
              let subTitle: string = 'Courier personnel record has been updated.'
              this.modal.promptSuccessModal(subTitle, null, 'OK', RoutesConstant.COURIER_PERSONNEL_RECORD);
            } else {
              this.modal.promptErrorModal(response.message, null, 'OK');
            }
            this.submitLoading = false;
          })
        )
      )

    }
  }

  fileChange(event): void {
    this.uploadedFile = event.target.files;

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const isJpgOrPngOrJpeg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJpgOrPngOrJpeg) {
        this.msg.error('You can only upload JPG, JPEG and PNG format!');
        this.uploadedFileValid = false;
        this.uploadedFileErrorMsg = 'You can only upload JPG, JPEG and PNG format!';
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
      this.profileImg.patchValue(this.uploadedFileName);

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
    this.profileImg.patchValue(null);
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  get mobileNo(): AbstractControl {
    return this.personnelForm.get('mobileNo');
  }

  get address(): AbstractControl {
    return this.personnelForm.get('address');
  }

  get city(): AbstractControl {
    return this.personnelForm.get('city');
  }

  get postcode(): AbstractControl {
    return this.personnelForm.get('postcode');
  }

  get state(): AbstractControl {
    return this.personnelForm.get('state');
  }

  get startDate(): AbstractControl {
    return this.personnelForm.get('startDate');
  }

  get position(): AbstractControl {
    return this.personnelForm.get('position');
  }

  get profileImg(): AbstractControl {
    return this.personnelForm.get('profileImg');
  }

}
