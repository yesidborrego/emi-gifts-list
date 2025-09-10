export interface Product {
  id: number;
  name: string;
  quantity: number;
}

export interface User {
  name: string;
}

export interface ClaimedGift {
  userId: string;
  productId: number;
  quantity: number;
}

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Juego de Sábanas de Lino",
    quantity: 2,
  },
  {
    id: 2,
    name: "Vajilla de Cerámica (16 piezas)",
    quantity: 1,
  },
  {
    id: 3,
    name: "Set de Cuchillos de Chef",
    quantity: 1,
  },
  {
    id: 4,
    name: "Cafetera de Prensa Francesa",
    quantity: 3,
  },
  {
    id: 5,
    name: "Robot Aspirador Inteligente",
    quantity: 1,
  },
  {
    id: 6,
    name: "Juego de Toallas de Baño (6 piezas)",
    quantity: 4,
  },
  {
    id: 7,
    name: "Altavoz Bluetooth Portátil",
    quantity: 2,
  },
];

// Por ahora, los usuarios y regalos reclamados estarán vacíos.
export const users: User[] = [];
export const claimedGifts: ClaimedGift[] = [];
