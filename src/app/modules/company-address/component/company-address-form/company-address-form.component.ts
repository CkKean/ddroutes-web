import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {postCodeValidator} from "../../../shared/validators/customvalidator.validator";
import {CompanyAddressModel} from "../../../shared/model/company-address/company-address.model";
import {distinctUntilChanged, tap} from "rxjs/operators";
import {UtilityService} from "../../../shared/services/utility.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {UtilityModel} from "../../../shared/model/utility.model";
import {CompanyAddressService} from "../../service/company-address.service";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {IResponse} from "../../../shared/model/i-response";

@Component({
  selector: 'app-company-address-form',
  templateUrl: './company-address-form.component.html',
  styleUrls: ['./company-address-form.component.scss']
})
export class CompanyAddressFormComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  @Input() companyAddressData: CompanyAddressModel;
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();

  companyAddressForm: FormGroup;
  stateList: UtilityModel[];
  submitData: CompanyAddressModel;

  constructor(private utilityService: UtilityService,
              private companyAddressService: CompanyAddressService,
              private subHandlingService: SubHandlingService) {
  }

  ngOnInit(): void {
    this.initForm();
    this.stateList =  this.utilityService.getState();
  }

  initForm(): void {
    this.companyAddressForm = new FormGroup({
      address: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [Validators.required, postCodeValidator]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      fullAddress: new FormControl({value: '', disabled: true}),
    });
    if (this.companyAddressData) {
      this.companyAddressForm.patchValue(this.companyAddressData);
      this.getFullAddress();
    }
    this.subscribeState();
  }

  handleData(): void {
    markFormGroupTouched(this.companyAddressForm);
    getInvalidControls(this.companyAddressForm);
    if (this.companyAddressForm.invalid) {
      return;
    }

    this.submitData = this.companyAddressForm.getRawValue();
  }

  submitAdd(): void {
    this.handleData();
    this.subHandlingService.subscribe(
      this.companyAddressService.create(this.submitData).pipe(
        tap((response: IResponse<string>) => {
          if (response.success) {
            this.refreshTable.emit();
          }
        })
      )
    )
  }

  submitEdit(): void {
    this.handleData();
    this.submitData.id = this.companyAddressData.id;
    this.subHandlingService.subscribe(
      this.companyAddressService.update(this.submitData).pipe(
        tap((response: IResponse<string>) => {
          if (response.success) {
            this.refreshTable.emit();
          }
        })
      )
    )
  }

  getFullAddress(): void {
    let fullAddress = '';
    if (this.address.value) {
      fullAddress += this.address.value;
      if (this.postcode.value) {
        fullAddress += (', ' + this.postcode.value);
      }
      if (this.city.value) {
        fullAddress += (' ' + this.city.value);
      }
      if (this.state.value) {
        fullAddress += (', ' + this.state.value);
      }
    }
    this.fullAddress.patchValue(fullAddress);
  }

  subscribeState(): void {
    this.state.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
        this.getFullAddress();
      }
    )
  }

  clearForm(): void {
    this.companyAddressForm.reset();
  }

  get address(): AbstractControl {
    return this.companyAddressForm.get('address');
  }

  get postcode(): AbstractControl {
    return this.companyAddressForm.get('postcode');
  }

  get city(): AbstractControl {
    return this.companyAddressForm.get('city');
  }

  get state(): AbstractControl {
    return this.companyAddressForm.get('state');
  }

  get fullAddress(): AbstractControl {
    return this.companyAddressForm.get('fullAddress');
  }
}
