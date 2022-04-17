import Price from '../types/Price';
import Food from './Food.model';
import Restaurant from './Restaurant.model';


interface IFieldContent {
  name: string;
  type: string;
  addField: boolean;
  Obligatoire: boolean;
  label: string;
}
interface Menu {
  _id: string;
  priority: number;
  restaurant?: Restaurant;
  type: 'per_food' | 'priceless' | 'fixed_price';
  name: string;
  description: string;
  imageURL: string;
  foods: Array<{ food: Food; additionalPrice: Price }>;
  price: Price;
  field: IFieldContent[] | [];
  valueField: any;
  options: {
    title: string;
    maxOptions: number;
    items: Food[];
    isObligatory?: boolean;
  }[];
}

export default Menu;
