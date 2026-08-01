import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
          <path d="M18.364 5.636a9 9 0 0 1 0 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M4.929 4.929c-3.905 3.905-3.905 10.237 0 14.142m0 0L2.1 21m2.829-2.829L4.929 19.07M12 17.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 2a10 10 0 0 1 7.071 2.929M12 2a10 10 0 0 0-7.071 2.929M12 2v7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">Sin conexión</h1>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        Parece que no tienes conexión a internet en este momento. Revisa tu conexión e intenta de nuevo.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
      >
        Reintentar
      </Link>
    </div>
  );
}
