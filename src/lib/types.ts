export interface User {
  email?: string;
  id: number;
  name?: string;
  status?: boolean;
}

export interface Session {
  access_token: string;
  user: User;
}

export interface Product {
  amount: number;
  createdAt: Date;
  description?: string;
  id: string;
  name: string;
  updatedAt: Date;
}

export interface Assignment {
  assignedAmount: number;
  assignedAt: Date;
  id: string;
  product?: Product;
  productId: string;
  user?: User;
  userId: string;
}

export interface GiftListState {
  assignments: Assignment[];
  currentUser: User | null;
  products: Product[];
  users: User[];
}
