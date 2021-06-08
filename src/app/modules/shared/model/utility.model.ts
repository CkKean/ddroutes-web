export class UtilityModel {
  id?: number;
  name?: string;
  abbr?: string;
}

export class UtilitiesModel {
  state: UtilityModel[];
  race: UtilityModel[];
  religion: UtilityModel[];
}
