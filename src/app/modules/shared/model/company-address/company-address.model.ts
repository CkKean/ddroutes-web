export class CompanyAddressModel {
  id: number;
  address: string;
  city: string;
  state: string;
  postcode: string;
  latitude?: string;
  longitude?: string;
  formattedAddress?: string;
  fullAddress: string;
}
