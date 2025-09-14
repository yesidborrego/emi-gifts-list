export interface Visitor {
  id: number;
  name: string;
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  pivot: Pivot;
}

export interface Pivot {
  visitor_id: number;
  product_id: number;
  amount: number;
  created_at: null | string;
}
