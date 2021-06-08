import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  ConfirmedValidator,
  isValidEMailFormat,
  noWhitespaceValidator,
  PasswordReg
} from "../../../shared/validators/customvalidator.validator";
import {tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {User} from "../../../shared/model/register/user.model";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {SharedModalContentComponent} from "../../../shared/component/shared-modal-content/shared-modal-content.component";
import {differenceInCalendarDays} from "date-fns";
import {EmployeeRecordService} from "../../../employee-record/service/employee-record.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {RegisterService} from "../../../register/service/register.service";
import {ModalService} from "../../../shared/services/modal.service";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs";
import {AuthState} from "../../../core/state/auth.state";
import {EmployeePositionConstant} from "../../../../constant/employee-position.constant";
import {PersonalInformationFormComponent} from "../../../register/component/personal-information-form/personal-information-form.component";
import CryptoJS from 'crypto-js';

@Component({
  templateUrl: './create-courier-personnel.component.html',
  styleUrls: ['./create-courier-personnel.component.scss'],
  providers: [SubHandlingService]
})
export class CreateCourierPersonnelComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  @Select(AuthState.isAuthenticated) isAuthenticated: Observable<boolean>;

  courierPersonnelForm: FormGroup;
  passVisible: boolean = false;
  cpassVisible: boolean = false;
  formDisable: boolean = true;
  usernameValid: boolean = false;
  emailValid: boolean = false;
  submitLoading: boolean = false;
  dateFormat = 'dd/MM/yyyy';

  imageSrc: any;
  uploadedFile: File[];
  uploadedFileName: string;
  uploadedFileValid: boolean = true;
  uploadedFileErrorMsg: string;

  employeePositionType = EmployeePositionConstant.EMPLOYEE_POSITION_ARR;

  @ViewChild(PersonalInformationFormComponent) personalInfoForm: PersonalInformationFormComponent;

  constructor(private fb: FormBuilder,
              private employeeRecordService: EmployeeRecordService,
              private subHandlingService: SubHandlingService,
              private registerService: RegisterService,
              private nzModal: NzModalService, private modal: ModalService,
              private router: Router, private msg: NzMessageService) {
  }

  ngOnInit(): void {
    this.initCreateCourierOrderFormForm();
  }

  initCreateCourierOrderFormForm(): void {
    this.courierPersonnelForm = this.fb.group(
      {
        username: [null, [Validators.required, noWhitespaceValidator]],
        email: [null, [Validators.required, isValidEMailFormat, noWhitespaceValidator]],
        password: [{
          value: null,
          disabled: true
        }, [Validators.required, PasswordReg, noWhitespaceValidator, Validators.minLength(8)]],
        confirmPassword: [{value: null, disabled: true}, [Validators.required, noWhitespaceValidator]],
        position: [{value: null, disabled: true}, [Validators.required]],
        startDate: [{value: new Date(), disabled: true}, [Validators.required]],
        profileImg: [{value: null, disabled: true}],
      },
      {
        validator: ConfirmedValidator(
          'password',
          'confirmPassword'
        ),
      }
    );
  }

  onBlurUsername(event): void {
    if (event.target.value) {
      this.subHandlingService.subscribe(
        this.registerService.verifyUsername(event.target.value).pipe(
          tap((response: IResponse<any>) => {
            this.usernameValid = response.success;
            if (response.success) {
              if (this.emailValid) {
                this.passwordEnabled();
              }
              this.username.setErrors(null);
            } else {
              this.passwordDisabled();
              this.username.setErrors({existed: true});
              if (!this.emailValid && this.email.value) {
                this.email.setErrors({existed: true});
              }
            }
          })
        )
      );
    } else if (!event.target.value || event.target.value === '') {
      this.passwordDisabled();
    }
  }

  onBlurEmail(event): void {
    if (event.target.value && this.email.valid) {
      this.subHandlingService.subscribe(
        this.registerService.verifyEmail(event.target.value).pipe(
          tap((response: IResponse<any>) => {
            this.emailValid = response.success;
            if (response.success) {
              if (this.usernameValid) {
                this.passwordEnabled();
              }
              this.email.setErrors(null);
            } else {
              this.passwordDisabled();
              this.email.setErrors({existed: true});
              if (!this.usernameValid && this.username.value) {
                this.username.setErrors({existed: true});
              }
            }
          })
        )
      );
    } else if (!event.target.value || event.target.value === '') {
      this.passwordDisabled();
    }
  }

  submitForm(): void {
    markFormGroupTouched(this.courierPersonnelForm);
    getInvalidControls(this.courierPersonnelForm);
    if (this.courierPersonnelForm.invalid || !this.uploadedFileValid) {
      return;
    }
    this.personalInfoForm.submitPersonalForm();

    let user: User = {...this.courierPersonnelForm.getRawValue(), ...this.personalInfoForm.getPersonalFormRawValue()};
    user.password = CryptoJS.SHA256(user.password).toString();
    user.userType = 1;

    let formData = new FormData();

    if (this.imageSrc && this.uploadedFile && this.uploadedFileValid) {
      let fileType = this.uploadedFile[0].type.split('/')[1];
      formData.append("file", this.uploadedFile[0], ('CP_' + user.fullName + '.' + fileType));
    }
    formData.append("user", JSON.stringify(user));

    if (user && this.courierPersonnelForm.valid && this.personalInfoForm.personalForm.valid) {
      this.submitLoading = true;
      this.subHandlingService.subscribe(
        this.employeeRecordService.create(formData).pipe(
          tap((response: IResponse<any>) => {
            if (response.success) {
              let subTitle: string = "Courier Personnel record has been created."
              this.modal.promptSuccessModal(subTitle, null, 'OK', RoutesConstant.COURIER_PERSONNEL_RECORD);
            } else {
              this.modal.promptErrorModal(response.message, null, 'OK');
            }
            this.submitLoading = false;
          })
        )
      );
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
      this.profileImg.patchValue(this.uploadedFile);

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

  cancelForm(): void {
    const modal: NzModalRef = this.nzModal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Confirm',
        subtitle: ' Are your sure you want to cancel this Courier Personnel Creation?\n' +
          '  This action cannot be undone.',
        status: 'warning',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        nzOnOk: () => {
          modal.close();
          this.router.navigate([RoutesConstant.COURIER_PERSONNEL_RECORD]);
        },
        nzOnCancel: () => modal.close()
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  passwordEnabled(): void {
    this.formDisable = false;
    this.courierPersonnelForm.enable();
  }

  passwordDisabled(): void {
    this.formDisable = true;
    this.courierPersonnelForm.disable();
    this.username.enable();
    this.email.enable();
  }

  passwordToggle(): void {
    this.passVisible = !this.passVisible;
  }

  confirmPasswordToggle(): void {
    this.cpassVisible = !this.cpassVisible;
  }

  get username(): AbstractControl {
    return this.courierPersonnelForm.get('username');
  }

  get email(): AbstractControl {
    return this.courierPersonnelForm.get('email');
  }

  get password(): AbstractControl {
    return this.courierPersonnelForm.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.courierPersonnelForm.get('confirmPassword');
  }

  get position(): AbstractControl {
    return this.courierPersonnelForm.get('position');
  }

  get startDate(): AbstractControl {
    return this.courierPersonnelForm.get('startDate');
  }

  get profileImg(): AbstractControl {
    return this.courierPersonnelForm.get('profileImg');
  }

}
