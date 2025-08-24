export interface IProduct {
  _id?: string;
  name: string;
  brand: string;
  model?: string;
  description: string;
  price: number;
  category: string;
  color?: string;
  dimensions?: string;
  weight?: string;
  energyRating?: string;
  madeIn?: string;
  distributor?: string;
  warranty?: string;
  quality?: string;
  imageURL?: string;
  features?: string[];
}