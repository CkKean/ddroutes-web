import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators,} from '@angular/forms';
import {
  ConfirmedValidator,
  isValidEMailFormat,
  noWhitespaceValidator,
  PasswordReg,
} from 'src/app/modules/shared/validators/customvalidator.validator';
import {RegisterService} from "../../service/register.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {distinctUntilChanged, tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {PersonalInformationFormComponent} from "../personal-information-form/personal-information-form.component";
import {User} from "../../../shared/model/register/user.model";
import CryptoJS from 'crypto-js';
import {Router} from "@angular/router";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs";
import {SharedModalContentComponent} from "../../../shared/component/shared-modal-content/shared-modal-content.component";
import {AuthState} from "../../../core/state/auth.state";

@Component({
  selector: 'app-account-information-form',
  templateUrl: './account-information-form.component.html',
  styleUrls: ['./account-information-form.component.scss'],
  providers: [SubHandlingService]
})
export class AccountInformationFormComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  @Select(AuthState.isAuthenticated) isAuthenticated: Observable<boolean>;

  registerForm: FormGroup;
  passVisible: boolean = false;
  cpassVisible: boolean = false;
  formDisable: boolean = true;
  usernameValid: boolean = false;
  emailValid: boolean = false;
  submitLoading: boolean = false;
  buttonDisable: boolean = true;

  @ViewChild(PersonalInformationFormComponent) personalInfoForm: PersonalInformationFormComponent;

  constructor(private fb: FormBuilder,
              private registerService: RegisterService,
              private subHandlingService: SubHandlingService,
              private modal: NzModalService,
              private router: Router) {
  }

  ngOnInit() {
    this.initRegisterForm();
    this.subscribeAgree();
  }

  initRegisterForm(): void {
    this.registerForm = this.fb.group(
      {
        username: [null, [Validators.required, noWhitespaceValidator]],
        email: [null, [Validators.required, isValidEMailFormat, noWhitespaceValidator]],
        password: [{
          value: null,
          disabled: true
        }, [Validators.required, PasswordReg, noWhitespaceValidator, Validators.minLength(8)]],
        confirmPassword: [{value: null, disabled: true}, [Validators.required, noWhitespaceValidator]],
        agree: [false, [Validators.required]]
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
    markFormGroupTouched(this.registerForm);
    getInvalidControls(this.registerForm);
    if (this.registerForm.invalid || this.buttonDisable) {
      return;
    }
    this.personalInfoForm.submitPersonalForm();

    let user: User = {...this.registerForm.getRawValue(), ...this.personalInfoForm.getPersonalFormRawValue()};
    user.password = CryptoJS.SHA256(user.password).toString();
    user.userType = 2;
    user.mobileNo = '60' + user.mobileNo
    let status: string;
    let subTitle: string;

    if (user && this.registerForm.valid && this.personalInfoForm.personalForm.valid) {
      this.submitLoading = true;
      this.subHandlingService.subscribe(
        this.registerService.signup(user).pipe(
          tap((response: IResponse<any>) => {
            if (response.success) {
              status = 'success';
              subTitle = 'Congratulation. Your account have been created.\n' +
                '  Please login. Thank you.';
            } else {
              status = 'error';
              subTitle = response.message;
            }
            this.promptModal(status, subTitle);
            this.submitLoading = false;
          })
        )
      );
    }
  }

  cancelForm(): void {
    const modal: NzModalRef = this.modal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Confirm',
        subtitle: ' Are your sure you want to cancel this Online Registration?\n' +
          '  This action cannot be undone.',
        status: 'warning',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        nzOnOk: () => {
          modal.close();
          this.router.navigate(['/']);
        },
        nzOnCancel: () => modal.close()
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  promptModal(status: string, subTitle: string): void {
    const modal: NzModalRef = this.modal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: status === 'error' ? 'Failed' : 'Success',
        subtitle: subTitle,
        status: status,
        cancelText: 'Cancel',
        confirmText: 'OK',
        nzOnOk: () => {
          modal.close();
          if (status === 'success') {
            this.router.navigate(['/']);
          }
        }
      },
      nzOnCancel: () => {
        modal.close();
        if (status === 'success') {
          this.router.navigate(['/']);
        }
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  subscribeAgree(): void {
    this.agree.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.buttonDisable = !value;
    })
  }

  passwordEnabled(): void {
    this.formDisable = false;
    this.registerForm.enable();
  }

  passwordDisabled(): void {
    this.formDisable = true;
    this.registerForm.disable();
    this.username.enable();
    this.agree.enable();
    this.email.enable();
  }

  passwordToggle(): void {
    this.passVisible = !this.passVisible;
  }

  confirmPasswordToggle(): void {
    this.cpassVisible = !this.cpassVisible;
  }

  get username(): AbstractControl {
    return this.registerForm.get('username');
  }

  get email(): AbstractControl {
    return this.registerForm.get('email');
  }

  get password(): AbstractControl {
    return this.registerForm.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.registerForm.get('confirmPassword');
  }

  get agree(): AbstractControl {
    return this.registerForm.get('agree');
  }
}
