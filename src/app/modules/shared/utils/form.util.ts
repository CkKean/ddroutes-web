import {FormGroup} from "@angular/forms";


export function markFormGroupTouched(formGroup: FormGroup) {
  (<any>Object).values(formGroup.controls).forEach(control => {
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity();
    if (control.controls) {
      this.markFormGroupTouched(control);
    }
  });
}

export function getInvalidControls(formGroup: FormGroup) {
  const invalid = [];
  const controls = formGroup.controls;
  for (const name in controls) {
    if (controls[name].invalid) {
      invalid.push(name);
    }
  }
  scrollToInvalidControls();
  return invalid;
}

export function scrollToInvalidControls() {
  const firstElementWithError = document.querySelector('.ng-invalid');

  if (firstElementWithError) {
    firstElementWithError.scrollIntoView({behavior: 'smooth'});
  }
}

export function getErrorControls() {
  const firstElementWithError = document.querySelector('.ng-invalid');
  if (firstElementWithError)
    scrollToInvalidControls();
  return firstElementWithError;
}
