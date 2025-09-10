import { NextResponse } from 'next/server';
import { users } from '../../../lib/data';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'El nombre es obligatorio' }, { status: 400 });
    }

    const existingUser = users.find(
      (user) => user.name.toLowerCase() === name.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json({ message: 'Este nombre ya está en uso. Por favor, elige otro.' }, { status: 409 });
    }

    users.push({ name });

    // En una aplicación real, aquí se crearía una sesión o se emitiría un token JWT.
    // Por ahora, solo confirmamos el registro.
    return NextResponse.json({ message: 'Inicio de sesión exitoso' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Ha ocurrido un error en el servidor' }, { status: 500 });
  }
}
