import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {AuthService} from "../../../core/services/auth.service";
import CryptoJS from 'crypto-js';
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {BaseComponent} from "../../../shared/component/base-component/base-component.component";
import {takeUntil} from "rxjs/operators";
import {Router} from "@angular/router";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {SharedModalContentComponent} from "../../../shared/component/shared-modal-content/shared-modal-content.component";
import {RoutesConstant} from "../../../../constant/routes.constant";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  providers: [SubHandlingService]
})
export class LoginFormComponent extends BaseComponent implements OnInit {

  loginForm: FormGroup;
  passwordVisible: boolean = false;
  loginBtnDisable: boolean = true;
  loginBtnLoading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private subHandlingService: SubHandlingService, private router: Router, private modal: NzModalService,) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
    this.subscribeForm();
  }

  passwordToggle(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  submit(): void {

    markFormGroupTouched(this.loginForm);
    getInvalidControls(this.loginForm);
    if (this.loginForm.invalid) {
      return;
    }

    this.loginBtnLoading = true;

    this.authService.login(this.username.value, CryptoJS.SHA256(this.password.value).toString()).subscribe(res => {
      this.loginBtnLoading = false;
      if (!res.success) {
        this.failedSubmission(res.message);
        this.password.setValue('');
      }
    }, error => {
      this.loginBtnLoading = false;
      this.failedSubmission(error.message);
      this.password.setValue('');
    })
  }

  subscribeForm(): void {
    this.loginForm.valueChanges.pipe(takeUntil(this.onDestroySubject)).subscribe(value => {
      if (value.username && value.password) {
        this.loginBtnDisable = false;
      } else {
        this.loginBtnDisable = true;
      }
    });
  }

  failedSubmission(subTitle: string): void {
    const modal: NzModalRef = this.modal.create({
      nzContent: SharedModalContentComponent,
      nzMaskClosable: false,
      nzClassName: 'confirmation-modal',
      nzClosable: true,
      nzComponentParams: {
        title: 'Error',
        subtitle: subTitle,
        status: 'error',
        cancelText: 'Cancel',
        confirmText: 'OK',
        nzOnOk: () => {
          modal.close();
        }
      },
      nzCentered: true,
      nzFooter: null,
    });
  }

  navigateRegister(): void {
    this.router.navigate([RoutesConstant.REGISTER]);
  }

  get username(): AbstractControl {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }
}
