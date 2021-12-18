import Accompaniment from './Accompaniment.model';
import Food from './Food.model';
import Menu from './Menu.model';
import Restaurant from './Restaurant.model';
import User from './User.model';

export type CommandType = 'delivery' | 'on_site' | 'takeaway';

export interface Customer {
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
}

export type PaymentStatus =
  | {
    status: boolean;
    paymentChargeId: string;
  }
  | { status: boolean; paymentIntentId: string };

export type Option = {
  title: string;
  maxOptions: number;
  items: {
    price: any;
    item: Accompaniment;
    quantity: number;
  }[];
};

export interface MenuInCommand {
  quantity: number;
  item: Menu & { name: { [key: string]: string } };
  foods: {
    food: Food & { name: { [key: string]: string } };
    options: Option[];
  }[];
}

export interface FoodInCommand {
  quantity: number;
  item: Food & { name: { [key: string]: string } };
  options: Option[];
}

export type DeliveryOption = 'behind_the_door' | 'on_the_door' | 'out';

export interface Command {
  _id: string;
  comment: string;
  relatedUser?: User;
  code: number;
  optionLivraison: DeliveryOption;
  etage: number;
  appartement: string;
  customer?: Customer;
  commandType: CommandType;
  shippingAddress: string;
  remiseCode: string;
  remiseTotal: string;
  remiseDelivery: string;
  shippingTime: number;
  priceLivraison: string;
  totalPriceSansRemise: string;
  shipAsSoonAsPossible: boolean;
  totalPrice: number;
  confirmed: boolean;
  payed: PaymentStatus;
  validated: boolean;
  revoked: boolean;
  restaurant: any;
  menus: MenuInCommand[];
  items: FoodInCommand[];
  menuWeb: any[];
  priceless: boolean;
  createdAt: string;
  updatedAt: string;
  confirmationCode: string;
  paiementLivraison?: boolean;
  discountIsPrice: string;
  deliveryPrice: any;
  discountPrice: any;
  isCodePromo: any;
  codePromo: any;
  discountDelivery: string;
  discountCode: string;
  hasDelivery: boolean;
}

export default Command;
