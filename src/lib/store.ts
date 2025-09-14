import type { User, Product, Assignment, GiftListState } from "./types";

class GiftListStore {
  private state: GiftListState = {
    users: [],
    products: [
      // Sample data for demonstration
      // {
      //   id: "1",
      //   name: "Smartphone Samsung Galaxy",
      //   amount: 2,
      //   description: "Último modelo con cámara de alta resolución",
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: "2",
      //   name: "Auriculares Bluetooth",
      //   amount: 5,
      //   description: "Cancelación de ruido activa",
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: "3",
      //   name: "Tablet iPad Air",
      //   amount: 1,
      //   description: "Perfecta para trabajo y entretenimiento",
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   id: "4",
      //   name: "Smartwatch Apple Watch",
      //   amount: 3,
      //   description: "Monitoreo de salud y fitness",
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
    ],
    assignments: [],
    currentUser: null,
  };

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  getState(): GiftListState {
    return { ...this.state };
  }

  // User management
  createUser(name: string, isAdmin = false): User {
    const existingUser = this.state.users.find(
      (u) => u.name?.toLowerCase() === name.toLowerCase()
    );
    if (existingUser) {
      throw new Error("Ya existe un usuario con ese nombre");
    }

    const newUser: User = {
      id: Date.now(),
      name,
      status: isAdmin,
    };

    this.state.users.push(newUser);
    this.notify();
    return newUser;
  }

  login(name: string, isAdmin = false): User {
    let user = this.state.users.find(
      (u) => u.name?.toLowerCase() === name.toLowerCase()
    );

    if (!user) {
      user = this.createUser(name, isAdmin);
    }

    this.state.currentUser = user;
    this.notify();
    return user;
  }

  logout() {
    this.state.currentUser = null;
    this.notify();
  }

  // Product management
  createProduct(name: string, amount: number, description?: string): Product {
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      amount,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.state.products.push(newProduct);
    this.notify();
    return newProduct;
  }

  updateProduct(
    id: string,
    updates: Partial<Omit<Product, "id" | "createdAt">>
  ): Product {
    const index = this.state.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    this.state.products[index] = {
      ...this.state.products[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.notify();
    return this.state.products[index];
  }

  deleteProduct(id: string): void {
    this.state.products = this.state.products.filter((p) => p.id !== id);
    this.state.assignments = this.state.assignments.filter(
      (a) => a.productId !== id
    );
    this.notify();
  }

  // Assignment management
  assignProduct(
    userId: string,
    productId: string,
    assignedAmount: number
  ): Assignment {
    const product = this.state.products.find((p) => p.id === productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const existingAssignments = this.state.assignments
      .filter((a) => a.productId === productId)
      .reduce((total, a) => total + a.assignedAmount, 0);

    if (existingAssignments + assignedAmount > product.amount) {
      throw new Error("No hay suficiente cantidad disponible");
    }

    const existingAssignment = this.state.assignments.find(
      (a) => a.userId === userId && a.productId === productId
    );

    if (existingAssignment) {
      existingAssignment.assignedAmount += assignedAmount;
      this.notify();
      return existingAssignment;
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      userId,
      productId,
      assignedAmount,
      assignedAt: new Date(),
    };

    this.state.assignments.push(newAssignment);
    this.notify();
    return newAssignment;
  }

  unassignProduct(userId: string, productId: string): void {
    this.state.assignments = this.state.assignments.filter(
      (a) => !(a.userId === userId && a.productId === productId)
    );
    this.notify();
  }

  getAssignmentsByUser(userId: string): Assignment[] {
    return this.state.assignments
      .filter((a) => a.userId === userId)
      .map((a) => ({
        ...a,
        product: this.state.products.find((p) => p.id === a.productId),
        user: this.state.users.find((u) => u.id.toString() === a.userId),
      }));
  }

  getAvailableQuantity(productId: string): number {
    const product = this.state.products.find((p) => p.id === productId);
    if (!product) return 0;

    const assigned = this.state.assignments
      .filter((a) => a.productId === productId)
      .reduce((total, a) => total + a.assignedAmount, 0);

    return product.amount - assigned;
  }
}

export const giftListStore = new GiftListStore();
