import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Página No Encontrada</h2>
      <p className="mt-2 text-muted-foreground">
        Lo sentimos, la página que buscas no existe.
      </p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
