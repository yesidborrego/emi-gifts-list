export interface User {
  id: string;
  email?: string; // Mantengo email como opcional por si lo necesitas
  nombre?: string;
  esAdmin?: boolean;
  fechaCreacion?: Date;
}

export interface Session {
  access_token: string;
  user: User;
}

export interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  descripcion?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Asignacion {
  id: string;
  usuarioId: string;
  productoId: string;
  cantidadAsignada: number;
  fechaAsignacion: Date;
  usuario?: User;
  producto?: Producto;
}

export interface GiftListState {
  usuarios: User[];
  productos: Producto[];
  asignaciones: Asignacion[];
  usuarioActual: User | null;
}
