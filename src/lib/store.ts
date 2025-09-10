import type { User, Producto, Asignacion, GiftListState } from "./types"

class GiftListStore {
  private state: GiftListState = {
    usuarios: [],
    productos: [
      // Sample data for demonstration
      {
        id: "1",
        nombre: "Smartphone Samsung Galaxy",
        cantidad: 2,
        descripcion: "Último modelo con cámara de alta resolución",
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      },
      {
        id: "2",
        nombre: "Auriculares Bluetooth",
        cantidad: 5,
        descripcion: "Cancelación de ruido activa",
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      },
      {
        id: "3",
        nombre: "Tablet iPad Air",
        cantidad: 1,
        descripcion: "Perfecta para trabajo y entretenimiento",
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      },
      {
        id: "4",
        nombre: "Smartwatch Apple Watch",
        cantidad: 3,
        descripcion: "Monitoreo de salud y fitness",
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      },
    ],
    asignaciones: [],
    usuarioActual: null,
  }

  private listeners: (() => void)[] = []

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener())
  }

  getState(): GiftListState {
    return { ...this.state }
  }

  // User management
  crearUsuario(nombre: string, esAdmin = false): User {
    const usuarioExistente = this.state.usuarios.find((u) => u.nombre.toLowerCase() === nombre.toLowerCase())
    if (usuarioExistente) {
      throw new Error("Ya existe un usuario con ese nombre")
    }

    const nuevoUsuario: User = {
      id: Date.now().toString(),
      nombre,
      esAdmin,
      fechaCreacion: new Date(),
    }

    this.state.usuarios.push(nuevoUsuario)
    this.notify()
    return nuevoUsuario
  }

  iniciarSesion(nombre: string, esAdmin = false): User {
    let usuario = this.state.usuarios.find((u) => u.nombre.toLowerCase() === nombre.toLowerCase())

    if (!usuario) {
      usuario = this.crearUsuario(nombre, esAdmin)
    }

    this.state.usuarioActual = usuario
    this.notify()
    return usuario
  }

  cerrarSesion() {
    this.state.usuarioActual = null
    this.notify()
  }

  // Product management
  crearProducto(nombre: string, cantidad: number, descripcion?: string): Producto {
    const nuevoProducto: Producto = {
      id: Date.now().toString(),
      nombre,
      cantidad,
      descripcion,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }

    this.state.productos.push(nuevoProducto)
    this.notify()
    return nuevoProducto
  }

  actualizarProducto(id: string, updates: Partial<Omit<Producto, "id" | "fechaCreacion">>): Producto {
    const index = this.state.productos.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error("Producto no encontrado")
    }

    this.state.productos[index] = {
      ...this.state.productos[index],
      ...updates,
      fechaActualizacion: new Date(),
    }

    this.notify()
    return this.state.productos[index]
  }

  eliminarProducto(id: string): void {
    this.state.productos = this.state.productos.filter((p) => p.id !== id)
    this.state.asignaciones = this.state.asignaciones.filter((a) => a.productoId !== id)
    this.notify()
  }

  // Assignment management
  asignarProducto(usuarioId: string, productoId: string, cantidadAsignada: number): Asignacion {
    const producto = this.state.productos.find((p) => p.id === productoId)
    if (!producto) {
      throw new Error("Producto no encontrado")
    }

    const asignacionesExistentes = this.state.asignaciones
      .filter((a) => a.productoId === productoId)
      .reduce((total, a) => total + a.cantidadAsignada, 0)

    if (asignacionesExistentes + cantidadAsignada > producto.cantidad) {
      throw new Error("No hay suficiente cantidad disponible")
    }

    const asignacionExistente = this.state.asignaciones.find(
      (a) => a.usuarioId === usuarioId && a.productoId === productoId,
    )

    if (asignacionExistente) {
      asignacionExistente.cantidadAsignada += cantidadAsignada
      this.notify()
      return asignacionExistente
    }

    const nuevaAsignacion: Asignacion = {
      id: Date.now().toString(),
      usuarioId,
      productoId,
      cantidadAsignada,
      fechaAsignacion: new Date(),
    }

    this.state.asignaciones.push(nuevaAsignacion)
    this.notify()
    return nuevaAsignacion
  }

  desasignarProducto(usuarioId: string, productoId: string): void {
    this.state.asignaciones = this.state.asignaciones.filter(
      (a) => !(a.usuarioId === usuarioId && a.productoId === productoId),
    )
    this.notify()
  }

  obtenerAsignacionesPorUsuario(usuarioId: string): Asignacion[] {
    return this.state.asignaciones
      .filter((a) => a.usuarioId === usuarioId)
      .map((a) => ({
        ...a,
        producto: this.state.productos.find((p) => p.id === a.productoId),
        usuario: this.state.usuarios.find((u) => u.id === a.usuarioId),
      }))
  }

  obtenerCantidadDisponible(productoId: string): number {
    const producto = this.state.productos.find((p) => p.id === productoId)
    if (!producto) return 0

    const asignadas = this.state.asignaciones
      .filter((a) => a.productoId === productoId)
      .reduce((total, a) => total + a.cantidadAsignada, 0)

    return producto.cantidad - asignadas
  }
}

export const giftListStore = new GiftListStore()
