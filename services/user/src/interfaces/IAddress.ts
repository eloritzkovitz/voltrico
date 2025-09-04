export interface IAddress {
  label?: string;
  receiverFirstName?: string;
  receiverLastName?: string;
  receiverPhone?: string;
  street: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}