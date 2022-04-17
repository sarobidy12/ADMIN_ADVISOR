import Restaurant from "./Restaurant.model";


interface IFieldContent {
  name: string;
  type: string;
  addField: boolean;
  Obligatoire: boolean;
  label: string;
}
interface FoodType {
  _id: string;
  priority: number;
  tag: string;
  name: { [key: string]: string };
  restaurant?: Restaurant;
  field: IFieldContent[] | [];
  valueField: any;
}

export default FoodType;
