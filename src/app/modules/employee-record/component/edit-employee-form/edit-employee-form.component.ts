import {Component, OnInit} from '@angular/core';
import {User} from "../../../shared/model/register/user.model";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {postCodeValidator} from "../../../shared/validators/customvalidator.validator";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {UtilityService} from "../../../shared/services/utility.service";
import {UtilityModel} from "../../../shared/model/utility.model";
import {takeUntil, tap} from "rxjs/operators";
import {BaseComponent} from "../../../shared/component/base-component/base-component.component";
import {deepCopy} from "../../../shared/utils/common.util";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {differenceInCalendarDays} from "date-fns";
import {EmployeeRecordService} from "../../service/employee-record.service";
import {IResponse} from "../../../shared/model/i-response";
import {ActivatedRoute, Router} from "@angular/router";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {ModalService} from "../../../shared/services/modal.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {ApiRoutesConstant} from "../../../../constant/apiroutes.constant";
import {EmployeePositionConstant} from "../../../../constant/employee-position.constant";

@Component({
  selector: 'app-edit-employee-form',
  templateUrl: './edit-employee-form.component.html',
  styleUrls: ['./edit-employee-form.component.scss'],
  providers: [SubHandlingService]
})
export class EditEmployeeFormComponent extends BaseComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  username: string;
  employeeDetail: User;
  employeeDetailLoading: boolean = true;
  employeeForm: FormGroup;
  oriEmployeeForm: FormGroup;
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
    this.employeeDetailLoading = true;
    if (this.route.snapshot.queryParams) {
      this.username = this.route.snapshot.queryParams['username'];
      this.getEmployeeDetail();
      this.stateList = this.utilityService.getState();
    } else {
      this.modal.promptWarningModal('Employee record does not exist.', null, 'OK', RoutesConstant.EMPLOYEE_RECORD);
    }
  }

  initForm(): void {
    this.employeeForm = new FormGroup({
      mobileNo: new FormControl(this.employeeDetail.mobileNo, Validators.required),
      address: new FormControl(this.employeeDetail.address, Validators.required),
      city: new FormControl(this.employeeDetail.city, Validators.required),
      postcode: new FormControl(this.employeeDetail.postcode, [Validators.required, postCodeValidator]),
      state: new FormControl(this.employeeDetail.state, Validators.required),
      startDate: new FormControl(new Date(this.employeeDetail.startDate), Validators.required),
      position: new FormControl(this.employeeDetail.position, Validators.required),
      profileImg: new FormControl(this.employeeDetail.profileImg),
    });
    this.oriEmployeeForm = deepCopy(this.employeeForm);
    this.subscribeForm();
  }

  getEmployeeDetail(): void {
    this.employeeDetailLoading = true;
    this.subHandlingService.subscribe(
      this.employeeRecordService.findOne(this.username).pipe(
        tap((response: IResponse<User>) => {
          if (response.success) {
            this.employeeDetail = response.data;
            this.checkImageExist();
            this.initForm();
            this.employeeDetailLoading = false;
          }
        })
      )
    )
  }

  checkImageExist(): void {
    if (this.employeeDetail.profileImgPath && this.employeeDetail.profileImg) {
      this.imageSrc = ApiRoutesConstant.IMAGE_API + this.employeeDetail.profileImgPath + '/' + this.employeeDetail.profileImg;
      this.uploadedFileValid = true;
      this.uploadedFileName = this.employeeDetail.profileImg;
    }
  }

  subscribeForm(): void {
    this.employeeForm.valueChanges.pipe(takeUntil(this.onDestroySubject)).subscribe(value => {
      if (JSON.stringify(value) === JSON.stringify(this.oriEmployeeForm.getRawValue())) {
        this.submitDisabled = true;
      } else {
        this.submitDisabled = false;
      }
    });
  }

  cancelForm(): void {
    this.employeeForm.reset();
    this.employeeForm = deepCopy(this.oriEmployeeForm);
    this.removeFile();
    this.checkImageExist();

    this.submitDisabled = true;
    this.subscribeForm();

  }

  submitForm(): void {
    markFormGroupTouched(this.employeeForm);
    getInvalidControls(this.employeeForm);
    if (this.employeeForm.invalid || !this.uploadedFileValid) {
      return;
    }

    let employee: User = this.employeeForm.getRawValue();
    employee.userType = this.employeeDetail.userType;
    employee.username = this.employeeDetail.username;

    let formData = new FormData();

    if (this.imageSrc && this.uploadedFile) {
      let fileType = this.uploadedFile[0].type.split('/')[1];
      formData.append("file", this.uploadedFile[0], ('Employee_' + this.employeeDetail.fullName + '.' + fileType));
    }
    formData.append("user", JSON.stringify(employee));


    if (employee && this.employeeForm.valid) {
      this.submitLoading = true;
      this.subHandlingService.subscribe(
        this.employeeRecordService.update(formData).pipe(
          tap((response: IResponse<string>) => {
            if (response.success) {
              this.modal.promptSuccessModal(response.data, null, 'OK', RoutesConstant.EMPLOYEE_RECORD);
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
    return this.employeeForm.get('mobileNo');
  }

  get address(): AbstractControl {
    return this.employeeForm.get('address');
  }

  get city(): AbstractControl {
    return this.employeeForm.get('city');
  }

  get postcode(): AbstractControl {
    return this.employeeForm.get('postcode');
  }

  get state(): AbstractControl {
    return this.employeeForm.get('state');
  }

  get startDate(): AbstractControl {
    return this.employeeForm.get('startDate');
  }

  get position(): AbstractControl {
    return this.employeeForm.get('position');
  }

  get profileImg(): AbstractControl {
    return this.employeeForm.get('profileImg');
  }
}
