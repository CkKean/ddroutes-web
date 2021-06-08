import {UtilitiesModel, UtilityModel} from "../modules/shared/model/utility.model";

export const StateList: UtilityModel[] = [
  {id: 1, name: 'Johor', abbr: 'JHR'},
  {id: 2, name: 'Kedah', abbr: 'KDH'},
  {id: 3, name: 'Kelantan', abbr: 'KTN'},
  {id: 4, name: 'Melaka', abbr: 'MLK'},
  {id: 5, name: 'Negeri Sembilan', abbr: 'NSN'},
  {id: 6, name: 'Pahang', abbr: 'PHG'},
  {id: 7, name: 'Perak', abbr: 'PRK'},
  {id: 8, name: 'Perlis', abbr: 'PLS'},
  {id: 9, name: 'Pulau Pinang', abbr: 'PNG'},
  {id: 10, name: 'Sabah', abbr: 'SBH'},
  {id: 11, name: 'Sarawak', abbr: 'SWK'},
  {id: 12, name: 'Selangor', abbr: 'SGR'},
  {id: 13, name: 'Terengganu', abbr: 'TRG'},
  {id: 14, name: 'W.P Kuala Lumpur', abbr: 'KUL'},
  {id: 15, name: 'W.P Labuan', abbr: 'LBN'},
  {id: 16, name: 'W.P Putrajaya', abbr: 'PJY'},
];

export const CarBrandList: UtilityModel[] = [
  {id: 1, name: 'Alfa Romeo'},
  {id: 2, name: 'Audi'},
  {id: 3, name: 'Bentley'},
  {id: 4, name: 'BMW'},
  {id: 5, name: 'Bufori'},
  {id: 6, name: 'Chana'},
  {id: 7, name: 'Chery'},
  {id: 8, name: 'Ferrari'},
  {id: 9, name: 'Ford'},
  {id: 10, name: 'Havel'},
  {id: 11, name: 'Honda'},
  {id: 12, name: 'Hyundai'},
  {id: 13, name: 'Isuzu'},
  {id: 14, name: 'Jaguar'},
  {id: 15, name: 'Jeep'},
  {id: 16, name: 'Kia'},
  {id: 17, name: 'Lamborghini'},
  {id: 18, name: 'Land Rover'},
  {id: 19, name: 'Lexus'},
  {id: 20, name: 'Mazda'},
  {id: 21, name: 'Mercedes-Benz'},
  {id: 22, name: 'Mini'},
  {id: 23, name: 'Mitsubishi'},
  {id: 24, name: 'Nissan'},
  {id: 25, name: 'Perodua'},
  {id: 26, name: 'Peugeot'},
  {id: 27, name: 'Porsche'},
  {id: 28, name: 'Proton'},
  {id: 29, name: 'Subaru'},
  {id: 30, name: 'Suzuki'},
  {id: 31, name: 'Toyota'},
  {id: 32, name: 'Volkswagen'},
  {id: 33, name: 'Volvo'},
];


export const MotorcycleBrandList: UtilityModel[] = [
  {id: 1, name: 'BMW'},
  {id: 2, name: 'Honda'},
  {id: 3, name: 'Kawasaki'},
  {id: 4, name: 'Suzuki'},
  {id: 5, name: 'Sym'},
  {id: 6, name: 'Yamaha'},
];

export const RaceList: UtilityModel[] = [
  {id: 1, name: 'Chinese'},
  {id: 2, name: 'Indian'},
  {id: 3, name: 'Malay'},
  {id: 4, name: 'Native'},
  {id: 5, name: 'Other'},
];

export const ReligionList: UtilityModel[] = [
  {id: 1, name: 'Buddhist'},
  {id: 2, name: 'Christian'},
  {id: 3, name: 'Hindu'},
  {id: 4, name: 'Muslim'},
  {id: 5, name: 'Other'},
];

export const AllUtilities: UtilitiesModel = {
  race: RaceList, state: StateList, religion: ReligionList
};
