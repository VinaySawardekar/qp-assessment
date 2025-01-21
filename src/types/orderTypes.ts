export interface orderType {
  items: Array<itemsType>;
  user_id: number;
  address: string;
}

export type itemsType = {
  grocery_id: number;
  quantity: number;
};
