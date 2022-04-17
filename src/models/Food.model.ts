import Accompaniment from './Accompaniment.model';
import FoodAttribute from './FoodAttribute.model';
import FoodType from './FoodType.model';
import Restaurant from './Restaurant.model';

interface IFieldContent {
  name: string;
  type: string;
  addField: boolean;
  Obligatoire: boolean;
  label: string;
}

interface Food {
  _id: string;
  name: string;
  description?: string;
  type: FoodType;
  attributes: Array<FoodAttribute>;
  restaurant?: Restaurant;
  note: number;
  imageURL: string;
  priority: number;
  price: {
    amount: number;
    currency: 'eur' | 'usd';
  };
  statut: boolean;
  options: {
    title: string;
    maxOptions: number;
    items: Accompaniment[];
    isObligatory?: boolean;
  }[];
  imageNotContractual: boolean;
  allergene: string[];
  isAvailable?: boolean;
  field: IFieldContent[] | [];
  valueField: any;
}

export default Food;
