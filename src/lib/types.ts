export interface User {
  id: string
  nombre: string
  esAdmin: boolean
  fechaCreacion: Date
}

export interface Producto {
  id: string
  nombre: string
  cantidad: number
  descripcion?: string
  fechaCreacion: Date
  fechaActualizacion: Date
}

export interface Asignacion {
  id: string
  usuarioId: string
  productoId: string
  cantidadAsignada: number
  fechaAsignacion: Date
  usuario?: User
  producto?: Producto
}

export interface GiftListState {
  usuarios: User[]
  productos: Producto[]
  asignaciones: Asignacion[]
  usuarioActual: User | null
}
