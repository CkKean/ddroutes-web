import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';


export interface ValidationResult {
  [key: string]: boolean;
}

export function isValidEMailFormat(control: FormControl): ValidationResult {
  const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  if (!control.value) {
    return;
  }

  if (control.value && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
    return {invalidEmail: true};
  }

  return null;
}

export function PasswordReg(control: FormControl): ValidationResult {
  if (!control.value) {
    return;
  }
  let hasNumber = /\d/.test(control.value);
  let hasUpper = /[A-Z]/.test(control.value);
  let hasLower = /[a-z]/.test(control.value);
  const valid = hasNumber && hasUpper && hasLower;
  if (!valid) {
    return {invalid: true};
  } else {
    return null;
  }
}

export function ConfirmedValidator(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (
      matchingControl.errors &&
      !matchingControl.errors.confirmedValidator
    ) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({confirmedValidator: true});
    } else {
      matchingControl.setErrors(null);
    }
  };
}

export function noWhitespaceValidator(control: FormControl): ValidationResult {
  let isValid: boolean = true;
  if (!control.value) {
    return;
  }
  if ((control.value as string).indexOf(' ') >= 0) {
    isValid = false;
  }

  return isValid ? null : {'whitespace': true};
}

export function existed(control: FormControl): ValidationResult {
  let isValid: boolean = true;
  // if (!control.value) {
  //   return;
  // }
  // if ((control.value as string).indexOf(' ') >= 0) {
  //   isValid = false;
  // }
  return null;
  // return isValid ? null : {'whitespace': true};
}

export function postCodeValidator(control: FormControl): ValidationResult {
  if (!control.value) {
    return;
  }
  let valid = /\b\d{5}\b/g.test(control.value);
  if (!valid) {
    return {invalidPostcode: true};
  } else {
    return null;
  }
}

export function oneRequiredForThreeControl(firstControl: string, secondControl: string, thirdControl: string): ValidatorFn {

  return (formGroup: FormGroup): ValidationErrors => {
    let control1 = formGroup.get(firstControl);
    let control2 = formGroup.get(secondControl);
    let control3 = formGroup.get(thirdControl);

    let a = Validators.required(control1) || {required: false};
    let b = Validators.required(control2) || {required: false};
    let c = Validators.required(control3) || {required: false};

    if (b['required']) {
      control1.setErrors({oneRequired: true});
      control2.setErrors({oneRequired: true});
      control3.setErrors({oneRequired: true});
    } else {
      control1.setErrors(null);
      control2.setErrors(null);
      control3.setErrors(null);
    }
    return;
  };

}
