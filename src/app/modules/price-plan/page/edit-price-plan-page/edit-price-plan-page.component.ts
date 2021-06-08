import {Component, OnInit} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {OptionModel} from "../../../shared/model/option.model";
import {PricePlanService} from "../../service/price-plan.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalService} from "../../../shared/services/modal.service";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {PricePlanModel} from "../../../shared/model/price-plan/price-plan.model";
import {distinctUntilChanged, takeUntil, tap} from "rxjs/operators";
import {ListOfDistancePrefix, ListOfWeightPrefix} from "../../../../constant/prefix.constant";
import {ListOfVehicleType} from "../../../../constant/vehicle-type.constant";
import {ListOfDistanceUnit, ListOfWeightUnit} from "../../../../constant/unit.constant";
import {IResponse} from "../../../shared/model/i-response";
import {BaseComponent} from "../../../shared/component/base-component/base-component.component";

@Component({
  templateUrl: './edit-price-plan-page.component.html',
  styleUrls: ['./edit-price-plan-page.component.scss'],
  providers: [SubHandlingService]
})
export class EditPricePlanPageComponent extends BaseComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  pricePlanIdParam: string;
  pricePlanData: PricePlanModel;
  pricePlanDataLoading: boolean = false;

  updateFormLoading: boolean = false;
  submitDisabled: boolean = true;
  pricePlanForm: FormGroup;

  listOfVehicle: string[] = ListOfVehicleType;
  vehicleTypeExisted: boolean = false;
  listOfWeightPrefix: string[] = ListOfWeightPrefix;
  listOfWeightUnit: OptionModel [] = ListOfWeightUnit;
  weightPrefixExisted: boolean = false;
  listOfDistancePrefix: string[] = ListOfDistancePrefix;
  listOfDistanceUnit: OptionModel[] = ListOfDistanceUnit;

  constructor(private pricePlanService: PricePlanService,
              private subHandlingService: SubHandlingService,
              private router: Router, private route: ActivatedRoute,
              private modal: ModalService) {
    super();
  }

  ngOnInit(): void {
    this.pricePlanDataLoading = true;
    if (this.route.snapshot.queryParams) {
      this.pricePlanIdParam = this.route.snapshot.queryParams['pricePlanId'];
      this.initForm();
      this.getPricePlanInfo();
    } else {
      this.modal.promptWarningModal('Price plan does not exist.', null, 'OK', RoutesConstant.PRICE_PLAN);
    }
  }

  initForm(): void {
    this.pricePlanForm = new FormGroup({
        vehicleType: new FormControl(null, [Validators.required]),
        newVehicleType: new FormControl(null),

        defaultWeightPrefix: new FormControl(this.listOfWeightPrefix[0], [Validators.required]),
        defaultWeight: new FormControl(null, [Validators.required]),
        defaultWeightUnit: new FormControl(this.listOfWeightUnit[0].value, [Validators.required]),
        newDefaultWeightPrefix: new FormControl(null),

        defaultDistancePrefix: new FormControl(this.listOfDistancePrefix[0], [Validators.required]),
        defaultDistance: new FormControl(null, [Validators.required]),
        defaultDistanceUnit: new FormControl(this.listOfDistanceUnit[0].value, [Validators.required]),

        defaultPricing: new FormControl(null, [Validators.required]),

        subDistanceEnable: new FormControl(false),
        subDistance: new FormControl({value: null, disabled: true}),
        subDistanceUnit: new FormControl({value: null, disabled: true}),
        subDistancePricing: new FormControl({value: null, disabled: true}),

        subWeightEnable: new FormControl(false),
        subWeight: new FormControl({value: null, disabled: true}),
        subWeightUnit: new FormControl({value: null, disabled: true}),
        subWeightPricing: new FormControl({value: null, disabled: true})
      }
    );
    this.subscribeSubWeightEnable();
    this.subscribeSubDistanceEnable();
  }

  getPricePlanInfo(): void {
    this.subHandlingService.subscribe(
      this.pricePlanService.findOne(this.pricePlanIdParam).pipe(
        tap((response: IResponse<PricePlanModel>) => {
          if (response.success) {
            this.pricePlanData = response.data;
            this.patchValueIntoForm();
            this.pricePlanDataLoading = false;
          } else {
            this.modal.promptWarningModal('Price plan does not exist.', null, 'OK', RoutesConstant.PRICE_PLAN);
          }
        })
      )
    )
  }

  patchValueIntoForm(): void {
    if (this.pricePlanData) {
      let tempVehicle = [...this.listOfVehicle.filter(value => value !== this.pricePlanData.vehicleType), this.pricePlanData.vehicleType];
      this.listOfVehicle = tempVehicle;

      if (this.pricePlanData.subWeight && this.pricePlanData.subWeightUnit && this.pricePlanData.subWeightPricing) {
        this.subscribeSubWeightEnable();
        this.subWeightEnable.patchValue(true);
        this.enableSubWeight();
      }
      if (this.pricePlanData.subDistance && this.pricePlanData.subDistanceUnit && this.pricePlanData.subDistancePricing) {
        this.subscribeSubDistanceEnable();
        this.subDistanceEnable.patchValue(true);
        this.enableSubDistance();
      }
    }
    this.pricePlanForm.patchValue(this.pricePlanData);
    this.subscribeForm();
  }

  subscribeForm(): void {
    this.pricePlanForm.valueChanges.pipe(takeUntil(this.onDestroySubject)).subscribe(value => {
      if (JSON.stringify(this.pricePlanData) !== JSON.stringify(value)) {
        this.submitDisabled = false;
      } else {
        this.submitDisabled = true;
      }
    });
  }

  cancelForm(): void {
    this.patchValueIntoForm();
    this.submitDisabled = true;
  }

  submitForm(): void {
    markFormGroupTouched(this.pricePlanForm);
    getInvalidControls(this.pricePlanForm);
    if (this.pricePlanForm.invalid) {
      return;
    }

    let pricePlanModel: PricePlanModel = this.pricePlanForm.getRawValue();
    pricePlanModel.pricePlanId = this.pricePlanData.pricePlanId;
    this.updateFormLoading = true;
    this.subHandlingService.subscribe(
      this.pricePlanService.updatePricePlan(pricePlanModel).pipe(
        tap((response: any) => {
          if (response.success) {
            this.modal.promptSuccessModal('Price plan have been updated.', null, null, RoutesConstant.PRICE_PLAN);
          } else {
            this.modal.promptErrorModal(response.message, null, null);
          }
          this.updateFormLoading = false;
        })
      )
    )
  }

  vehicleTypeSelect(open: boolean): void {
    if (!open) {
      this.newVehicleType.reset();
      this.vehicleTypeExisted = false;
    }
  }

  addNewVehicleType(): void {
    if (this.newVehicleType.value) {
      const value = this.newVehicleType.value;
      if (this.listOfVehicle.indexOf(value) === -1) {
        this.listOfVehicle = [...this.listOfVehicle, value];
        this.vehicleTypeExisted = false;
        this.newVehicleType.reset();
      } else {
        this.vehicleTypeExisted = true;
      }
    } else {
      this.vehicleTypeExisted = false;
    }
  }

  weightPrefixSelect(open: boolean): void {
    if (!open) {
      this.newDefaultWeightPrefix.reset();
      this.weightPrefixExisted = false;
    }
  }

  addNewWeightPrefix(): void {
    if (this.newDefaultWeightPrefix.value) {
      const value = this.newDefaultWeightPrefix.value;
      if (this.listOfWeightPrefix.indexOf(value) === -1) {
        this.listOfWeightPrefix = [...this.listOfWeightPrefix, value];
        this.weightPrefixExisted = false;
        this.newDefaultWeightPrefix.reset();
      } else {
        this.weightPrefixExisted = true;
      }
    } else {
      this.weightPrefixExisted = false;
    }
  }

  subscribeSubWeightEnable(): void {
    this.subWeightEnable.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      if (value) {
        this.enableSubWeight();
      } else {
        this.disableSubWeight();
      }
    });
  }

  enableSubWeight(): void {
    this.subWeight.enable();
    this.subWeightUnit.enable();
    this.subWeightUnit.patchValue(this.listOfWeightUnit[0].value);
    this.subWeightPricing.enable();

    this.subWeight.setValidators(Validators.required);
    this.subWeight.updateValueAndValidity();
    this.subWeightUnit.setValidators(Validators.required);
    this.subWeightUnit.updateValueAndValidity();
    this.subWeightPricing.setValidators(Validators.required);
    this.subWeightPricing.updateValueAndValidity();
  }

  disableSubWeight(): void {
    this.subWeight.disable();
    this.subWeightUnit.disable();
    this.subWeightPricing.disable();

    this.subWeight.reset();
    this.subWeightUnit.reset();
    this.subWeightPricing.reset();
  }

  subscribeSubDistanceEnable(): void {
    this.subDistanceEnable.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      if (value) {
        this.enableSubDistance();
      } else {
        this.disableSubDistance();
      }
    })
  }

  enableSubDistance(): void {
    this.subDistance.enable();
    this.subDistanceUnit.enable();
    this.subDistanceUnit.patchValue(this.listOfDistanceUnit[0].value);
    this.subDistancePricing.enable();

    this.subDistance.setValidators(Validators.required);
    this.subDistance.updateValueAndValidity();
    this.subDistanceUnit.setValidators(Validators.required);
    this.subDistanceUnit.updateValueAndValidity();
    this.subDistancePricing.setValidators(Validators.required);
    this.subDistancePricing.updateValueAndValidity();
  }

  disableSubDistance(): void {
    this.subDistance.disable();
    this.subDistanceUnit.disable();
    this.subDistancePricing.disable();

    this.subDistance.reset();
    this.subDistanceUnit.reset();
    this.subDistancePricing.reset();
  }

  get vehicleType(): AbstractControl {
    return this.pricePlanForm.get('vehicleType');
  }

  get newVehicleType(): AbstractControl {
    return this.pricePlanForm.get('newVehicleType');
  }

  get defaultWeightPrefix(): AbstractControl {
    return this.pricePlanForm.get('defaultWeightPrefix');
  }

  get newDefaultWeightPrefix(): AbstractControl {
    return this.pricePlanForm.get('newDefaultWeightPrefix');
  }

  get defaultWeight(): AbstractControl {
    return this.pricePlanForm.get('defaultWeight');
  }

  get defaultWeightUnit(): AbstractControl {
    return this.pricePlanForm.get('defaultWeightUnit');
  }

  get defaultDistancePrefix(): AbstractControl {
    return this.pricePlanForm.get('defaultDistancePrefix');
  }

  get defaultDistance(): AbstractControl {
    return this.pricePlanForm.get('defaultDistance');
  }

  get defaultDistanceUnit(): AbstractControl {
    return this.pricePlanForm.get('defaultDistanceUnit');
  }

  get defaultPricing(): AbstractControl {
    return this.pricePlanForm.get('defaultPricing');
  }

  get subDistanceEnable(): AbstractControl {
    return this.pricePlanForm.get('subDistanceEnable');
  }

  get subDistance(): AbstractControl {
    return this.pricePlanForm.get('subDistance');
  }

  get subDistanceUnit(): AbstractControl {
    return this.pricePlanForm.get('subDistanceUnit');
  }

  get subDistancePricing(): AbstractControl {
    return this.pricePlanForm.get('subDistancePricing');
  }

  get subWeightEnable(): AbstractControl {
    return this.pricePlanForm.get('subWeightEnable');
  }

  get subWeight(): AbstractControl {
    return this.pricePlanForm.get('subWeight');
  }

  get subWeightUnit(): AbstractControl {
    return this.pricePlanForm.get('subWeightUnit');
  }

  get subWeightPricing(): AbstractControl {
    return this.pricePlanForm.get('subWeightPricing');
  }

}
