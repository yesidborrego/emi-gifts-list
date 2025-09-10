import { NextResponse } from 'next/server';
import { initialProducts } from '../../../lib/data';

export async function GET() {
  try {
    // En una aplicación real, aquí se obtendrían los productos de una base de datos.
    // También se podría combinar con la lista de regalos reclamados para ajustar las cantidades.
    return NextResponse.json(initialProducts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Ha ocurrido un error en el servidor' }, { status: 500 });
  }
}
