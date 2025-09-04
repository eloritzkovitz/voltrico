export interface IPaymentMethod {
  type: "mock-card" | "paypal" | "other";
  providerName?: string;
  cardLast4?: string;
  expiry?: string;
  isDefault?: boolean;
}