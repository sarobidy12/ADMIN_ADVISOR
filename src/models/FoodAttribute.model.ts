

interface IFieldContent {
  name: string;
  type: string;
  addField: boolean;
  Obligatoire: boolean;
  label: string;
}

interface FoodAttribute {
  _id: string;
  tag: string;
  locales: { [key: string]: string };
  imageURL: string;
  field: IFieldContent[] | [];
  valueField: any;
}

export default FoodAttribute;
