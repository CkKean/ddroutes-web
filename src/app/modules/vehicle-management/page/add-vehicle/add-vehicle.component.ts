import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {noWhitespaceValidator} from "../../../shared/validators/customvalidator.validator";
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {VehicleService} from "../../service/vehicle.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {UtilityService} from "../../../shared/services/utility.service";
import {UtilityModel} from "../../../shared/model/utility.model";
import {NzMessageService} from "ng-zorro-antd/message";
import {distinctUntilChanged, tap} from "rxjs/operators";
import {User} from "../../../shared/model/register/user.model";
import {IResponse} from "../../../shared/model/i-response";
import {getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {VehicleModel} from "../../../shared/model/vehicle/vehicle.model";
import {BaseComponent} from "../../../shared/component/base-component/base-component.component";
import {Router} from "@angular/router";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {ModalService} from "../../../shared/services/modal.service";
import {ColorList} from "../../../../constant/color.constant";

@Component({
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
  providers: [SubHandlingService]
})
export class AddVehicleComponent extends BaseComponent implements OnInit {
  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  vehicleForm: FormGroup;
  formDisable: boolean = true;
  addFormLoading: boolean = false;
  carBrandList: UtilityModel[];
  motorCycleBrandList: UtilityModel[];
  displayBrandList: UtilityModel[];
  vehicleStaff: User[];
  colorList: Array<{ name: string }> = ColorList;

  imageSrc: any;
  uploadedFile: File[];
  uploadedFileName: string;
  uploadedFileValid: boolean = true;
  uploadedFileErrorMsg: string;

  constructor(private vehicleService: VehicleService, private utilityService: UtilityService,
              private subHandlingService: SubHandlingService, private msg: NzMessageService,
              private router: Router, private modal: ModalService, private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.getBrandList();
  }

  initForm(): void {
    this.vehicleForm = new FormGroup({
      plateNo: new FormControl(null, [Validators.required, noWhitespaceValidator]),
      brand: new FormControl({value: null, disabled: true}, [Validators.required]),
      model: new FormControl({value: null, disabled: true}, [Validators.required]),
      type: new FormControl({value: null, disabled: true}, [Validators.required]),
      color: new FormControl({value: null, disabled: true}, [Validators.required]),
      owner: new FormControl({value: null, disabled: true}, [Validators.required]),
      fuelEfficiency: new FormControl({value: null, disabled: true}, [Validators.required]),
      fuelEfficiencyUnit: new FormControl({value: 'Litre / 100 km', disabled: true}, [Validators.required]),
      fuelTank: new FormControl({value: null, disabled: true}, [Validators.required]),
      gpsTrackNo: new FormControl({value: null, disabled: true}),
      photo: new FormControl({value: null, disabled: true}),
    });
    this.subscribeVehicleType();
  }

  onBlurPlateNo(event): void {
    if (event.target.value && this.plateNo.valid) {
      this.subHandlingService.subscribe(
        this.vehicleService.checkDuplicateVehicle(event.target.value).pipe(
          tap((response: IResponse<any>) => {
            if (!response.success) {
              this.disableForm();
              this.plateNo.setErrors({existed: true});
            } else {
              this.enableForm();
              this.plateNo.setErrors(null);
            }
          })
        )
      )
    } else {
      this.disableForm();
    }
  }

  disableForm(): void {
    this.formDisable = true;
    this.vehicleForm.disable();
    this.plateNo.enable();
  }

  enableForm(): void {
    this.formDisable = false;
    this.vehicleForm.enable();
  }

  cancelForm(): void {
    this.modal.promptCancelModal('Vehicle', RoutesConstant.EMPLOYEE_RECORD);
  }

  getBrandList(): void {
    this.carBrandList = this.utilityService.getCarBrand();
    this.motorCycleBrandList = this.utilityService.getMotorCycleBrand();
    this.subHandlingService.subscribe(
      this.vehicleService.findAllVehicleStaff().pipe(
        tap((response: IResponse<any>) => {
          if (response.success)
            this.vehicleStaff = response.data;
        })
      )
    );
  }

  submitForm(): void {
    markFormGroupTouched(this.vehicleForm);
    getInvalidControls(this.vehicleForm);
    if (this.vehicleForm.invalid || !this.uploadedFileValid) {
      return;
    }

    let vehicleInformation: VehicleModel = this.vehicleForm.getRawValue();

    let formData = new FormData();

    if (this.uploadedFileValid && this.imageSrc && this.uploadedFile) {
      let fileType = this.uploadedFile[0].type.split('/')[1];
      formData.append("file", this.uploadedFile[0], ('vehicle_' + vehicleInformation.plateNo + '.' + fileType));
    }

    formData.append("vehicle", JSON.stringify(vehicleInformation));

    this.addFormLoading = true;
    this.subHandlingService.subscribe(
      this.vehicleService.createVehicle(formData).pipe(
        tap((response: IResponse<string>) => {
          if (response.success) {
            this.modal.promptSuccessModal(response.data, null, 'OK', RoutesConstant.VEHICLE_MANAGEMENT);
          } else {
            this.modal.promptErrorModal(response.message, null, 'OK');
          }
          this.addFormLoading = false;
        })
      )
    );
  }

  fileChange(event): void {
    this.uploadedFile = event.target.files;

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const isJpgOrPngOrJpeg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJpgOrPngOrJpeg) {
        this.msg.error('You can only upload JPG, JPEG and PNG format! Otherwise, no file will be uploaded.');
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
      this.photo.patchValue(this.uploadedFile);

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

  subscribeVehicleType(): void {
    this.type.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      if (value) {
        if (value === 'Car' || value === 'Truck') {
          this.displayBrandList = this.carBrandList;
        } else if (value === 'Motorcycle') {
          this.displayBrandList = this.motorCycleBrandList;
        }
        this.brand.patchValue(null);
        this.brand.markAsUntouched();
      }
    });
  }

  get plateNo(): AbstractControl {
    return this.vehicleForm.get('plateNo');
  }

  get brand(): AbstractControl {
    return this.vehicleForm.get('brand');
  }

  get model(): AbstractControl {
    return this.vehicleForm.get('model');
  }

  get type(): AbstractControl {
    return this.vehicleForm.get('type');
  }

  get color(): AbstractControl {
    return this.vehicleForm.get('color');
  }

  get owner(): AbstractControl {
    return this.vehicleForm.get('owner');
  }

  get fuelEfficiency(): AbstractControl {
    return this.vehicleForm.get('fuelEfficiency');
  }

  get fuelEfficiencyUnit(): AbstractControl {
    return this.vehicleForm.get('fuelEfficiencyUnit');
  }

  get fuelTank(): AbstractControl {
    return this.vehicleForm.get('fuelTank');
  }

  get gpsTrackNo(): AbstractControl {
    return this.vehicleForm.get('gpsTrackNo');
  }

  get photo(): AbstractControl {
    return this.vehicleForm.get('photo');
  }
}
