import Restaurant from "./Restaurant.model";

interface IFieldContent {
  name: string;
  type: string;
  addField: boolean;
  Obligatoire: boolean;
  label: string;
}
export default interface Accompaniment {
  _id: string;
  name: string;
  price: {
    amount: number;
    currency: "eur" | "usd";
  };
  imageURL: string;
  restaurant?: Restaurant;
  isObligatory?: boolean;
  priority: number;
  field: IFieldContent[] | [];
  valueField: any;
}
