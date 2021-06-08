import {Component, OnInit} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {UtilityModel} from "../../../shared/model/utility.model";
import {User} from "../../../shared/model/register/user.model";
import {VehicleService} from "../../service/vehicle.service";
import {UtilityService} from "../../../shared/services/utility.service";
import {SubHandlingService} from "../../../shared/services/subscription-handling.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {ActivatedRoute, Router} from "@angular/router";
import {noWhitespaceValidator} from "../../../shared/validators/customvalidator.validator";
import {distinctUntilChanged, takeUntil, tap} from "rxjs/operators";
import {IResponse} from "../../../shared/model/i-response";
import {getErrorControls, getInvalidControls, markFormGroupTouched} from "../../../shared/utils/form.util";
import {VehicleModel} from "../../../shared/model/vehicle/vehicle.model";
import {forkJoin} from "rxjs";
import {RoutesConstant} from "../../../../constant/routes.constant";
import {BaseComponent} from "../../../shared/component/base-component/base-component.component";
import {ModalService} from "../../../shared/services/modal.service";
import {deepCopy} from "../../../shared/utils/common.util";
import {ApiRoutesConstant} from "../../../../constant/apiroutes.constant";

@Component({
  templateUrl: './update-vehicle.component.html',
  styleUrls: ['./update-vehicle.component.scss'],
  providers: [SubHandlingService]
})
export class UpdateVehicleComponent extends BaseComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  vehicleForm: FormGroup;
  oriVehicleForm: FormGroup;
  submitDisabled: boolean = true;
  addFormLoading: boolean = false;
  carBrandList: UtilityModel[];
  motorCycleBrandList: UtilityModel[];
  displayBrandList: UtilityModel[];
  vehicleStaff: User[];

  colorList: Array<{ name: string }> = [
    {name: 'Black'},
    {name: 'Blue'},
    {name: 'Brown'},
    {name: 'Gold'},
    {name: 'Gray'},
    {name: 'Green'},
    {name: 'Orange'},
    {name: 'Red'},
    {name: 'Silver'},
    {name: 'White'},
    {name: 'Yellow'},
  ];

  imageSrc: any;
  uploadedFile: File[];
  uploadedFileName: string;
  uploadedFileValid: boolean = true;
  uploadedFileErrorMsg: string;

  plateNoParam: string;
  vehicleInfo: VehicleModel;
  vehicleAndBrandLoading: boolean = false;

  constructor(private vehicleService: VehicleService, private utilityService: UtilityService,
              private subHandlingService: SubHandlingService, private msg: NzMessageService,
              private router: Router, private route: ActivatedRoute,
              private modal: ModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.vehicleAndBrandLoading = true;

    if (this.route.snapshot.queryParams) {
      this.plateNoParam = this.route.snapshot.queryParams['plateNo'];
      this.initForm();
      this.getBrandAndVehicle();
    } else {
      this.modal.promptWarningModal('Vehicle does not exist.', null, 'OK', RoutesConstant.VEHICLE_MANAGEMENT);
    }
  }

  initForm(): void {
    this.vehicleForm = new FormGroup({
      plateNo: new FormControl(null, [Validators.required, noWhitespaceValidator]),
      brand: new FormControl(null, [Validators.required]),
      model: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      color: new FormControl(null, [Validators.required]),
      owner: new FormControl(null, [Validators.required]),
      fuelEfficiency: new FormControl(null, [Validators.required]),
      fuelEfficiencyUnit: new FormControl({value: null, disabled: true}, [Validators.required]),
      fuelTank: new FormControl(null, [Validators.required]),
      gpsTrackNo: new FormControl(null),
      photo: new FormControl(null),
    });
    this.subscribeVehicleType();
  }

  patchValueIntoForm(): void {
    this.vehicleForm.patchValue(this.vehicleInfo);
    this.brand.patchValue(this.vehicleInfo.brand);
    this.owner.patchValue(null);
    this.vehicleStaff.forEach(value => {
      if (value.fullName === this.vehicleInfo.owner) {
        this.owner.patchValue(value.userId);
      }
    });
    this.oriVehicleForm = deepCopy(this.vehicleForm);
    this.subscribeForm();
  }

  onBlurPlateNo(event): void {
    if (event.target.value && this.plateNo.valid && event.target.value !== this.vehicleInfo.plateNo) {
      this.subHandlingService.subscribe(
        this.vehicleService.checkDuplicateVehicle(event.target.value).pipe(
          tap((response: IResponse<any>) => {
            if (!response.success) {
              this.plateNo.setErrors({existed: true});
            } else {
              this.plateNo.setErrors(null);
            }
          })
        )
      )
    }
  }

  cancelForm(): void {
    this.vehicleForm = deepCopy(this.oriVehicleForm);
    this.removeFile();
    this.checkImageExist();
    this.submitDisabled = true;
    this.subscribeForm();
  }

  submitForm(): void {
    if (getErrorControls()) {
      return;
    }
    markFormGroupTouched(this.vehicleForm);
    getInvalidControls(this.vehicleForm);

    if (this.vehicleForm.invalid || !this.uploadedFileValid) {
      return;
    }

    let vehicleInformation: VehicleModel = this.vehicleForm.getRawValue();
    vehicleInformation.vehicleId = this.vehicleInfo.vehicleId;

    let formData = new FormData();
    if (this.imageSrc && this.uploadedFile) {
      let fileType = this.uploadedFile[0].type.split('/')[1];
      formData.append("file", this.uploadedFile[0], ('vehicle_' + vehicleInformation.plateNo + '.' + fileType));
    }
    formData.append("vehicle", JSON.stringify(vehicleInformation));

    if (this.vehicleForm.valid) {
      this.addFormLoading = true;
      this.subHandlingService.subscribe(
        this.vehicleService.updateVehicle(formData).pipe(
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
  }

  getBrandAndVehicle(): void {
    this.vehicleAndBrandLoading = true;
    this.carBrandList = this.utilityService.getCarBrand();
    this.motorCycleBrandList = this.utilityService.getMotorCycleBrand();

    const vehicleStaffList = this.vehicleService.findAllVehicleStaff();
    const vehicleInfo = this.vehicleService.findOne(this.plateNoParam);

    forkJoin({
      vehicleStaffList, vehicleInfo
    }).subscribe(({vehicleStaffList, vehicleInfo}) => {
      this.vehicleStaff = vehicleStaffList.data;
      this.vehicleInfo = vehicleInfo.data;
      this.checkImageExist();
      this.patchValueIntoForm();
      this.vehicleAndBrandLoading = false;
    });
  }

  checkImageExist(): void {
    if (this.vehicleInfo.photo && this.vehicleInfo.photoPath) {
      this.imageSrc = ApiRoutesConstant.IMAGE_API + this.vehicleInfo.photoPath + '/' + this.vehicleInfo.photo;
      this.uploadedFileValid = true;
      this.uploadedFileName = this.vehicleInfo.photo;
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
        this.uploadedFile = null;
        this.uploadedFileErrorMsg = 'You can only upload JPG, JPEG and PNG format! Otherwise, no file will be uploaded.';
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        this.uploadedFileValid = false;
        this.uploadedFile = null;
        this.uploadedFileErrorMsg = 'Image must smaller than 2MB!';
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
    if (this.vehicleInfo.photo && this.vehicleInfo.photoPath) {
      this.photo.patchValue(null);
    } else {
      this.photo.patchValue(this.vehicleInfo.photo);
    }
  }

  subscribeVehicleType(): void {
    this.type.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.brand.reset();
      if (value) {
        if (value === 'Car' || value === 'Truck') {
          this.displayBrandList = this.carBrandList;
        } else if (value === 'Motorcycle') {
          this.displayBrandList = this.motorCycleBrandList;
        }
      }
    });
  }

  subscribeForm(): void {
    this.vehicleForm.valueChanges.pipe(takeUntil(this.onDestroySubject)).subscribe(value => {
      if (JSON.stringify(this.oriVehicleForm.getRawValue()) !== JSON.stringify(value)) {
        this.submitDisabled = false;
      } else {
        this.submitDisabled = true;
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
