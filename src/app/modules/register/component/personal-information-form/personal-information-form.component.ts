import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {differenceInCalendarDays} from 'date-fns';
import {noWhitespaceValidator, postCodeValidator} from 'src/app/modules/shared/validators/customvalidator.validator';
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {UtilitiesModel} from "../../../shared/model/utility.model";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {UtilityService} from "../../../shared/services/utility.service";

@Component({
  selector: 'app-personal-information-form',
  templateUrl: './personal-information-form.component.html',
  styleUrls: ['./personal-information-form.component.scss'],
  providers: [SubHandlingService]
})
export class PersonalInformationFormComponent implements OnChanges, OnInit {
  @Input() formDisable: boolean;

  utility: UtilitiesModel;
  personalForm: FormGroup;
  dateFormat = 'dd/MM/yyyy';

  constructor(private subHandlingService: SubHandlingService, private utilityService: UtilityService) {
  }

  ngOnInit(): void {
    this.utility = this.utilityService.getAllUtilities();
    this.initForm();
  }

  initForm(): void {
    this.personalForm = new FormGroup({
      fullName: new FormControl({value: null, disabled: true}, [Validators.required]),
      dob: new FormControl({value: null, disabled: true}, Validators.required),
      gender: new FormControl({value: null, disabled: true}, Validators.required),
      mobileNo: new FormControl({value: null, disabled: true}, [Validators.required]),
      address: new FormControl({value: null, disabled: true}, [Validators.required]),
      country: new FormControl({value: 'Malaysia', disabled: true}, [Validators.required, noWhitespaceValidator]),
      state: new FormControl({value: null, disabled: true}, Validators.required),
      city: new FormControl({value: null, disabled: true}, [Validators.required]),
      postcode: new FormControl({
        value: null,
        disabled: true
      }, [Validators.required, postCodeValidator]),
      race: new FormControl({value: null, disabled: true}, Validators.required),
      religion: new FormControl({value: null, disabled: true}, Validators.required)
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['formDisable'].firstChange) {
      if (changes['formDisable'].currentValue === false) {
        this.personalForm.enable();
        this.country.disable();
      } else {
        this.personalForm.disable();
      }
    }
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  submitPersonalForm(): any {
    markFormGroupTouched(this.personalForm);
    getInvalidControls(this.personalForm);
    if (this.personalForm.invalid) {
      return;
    }
  }

  getPersonalFormRawValue(): any {
    return this.personalForm.getRawValue();
  }

  get fullName(): AbstractControl {
    return this.personalForm.get('fullName');
  }

  get dob(): AbstractControl {
    return this.personalForm.get('dob');
  }

  get gender(): AbstractControl {
    return this.personalForm.get('gender');
  }

  get mobileNo(): AbstractControl {
    return this.personalForm.get('mobileNo');
  }

  get address(): AbstractControl {
    return this.personalForm.get('address');
  }

  get city(): AbstractControl {
    return this.personalForm.get('city');
  }

  get state(): AbstractControl {
    return this.personalForm.get('state');
  }

  get postcode(): AbstractControl {
    return this.personalForm.get('postcode');
  }

  get country(): AbstractControl {
    return this.personalForm.get('country');
  }

  get race(): AbstractControl {
    return this.personalForm.get('race');
  }

  get religion(): AbstractControl {
    return this.personalForm.get('religion');
  }
}
