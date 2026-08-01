import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900">Red Técnico Fulltech</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Iniciar sesión</Button>
          </Link>
          <Link href="/register">
            <Button>Registrarse</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4 pb-20">
        <section className="py-16 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Únete a la red de aliados técnicos de{" "}
            <span className="text-blue-700">FULLTECH</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Forma parte de una red privada de técnicos y ayudantes que reciben
            oportunidades de trabajos eventuales de instalación, mantenimiento,
            reparación y soporte técnico en distintas zonas del país.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Quiero unirme a la red
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ya soy colaborador
              </Button>
            </Link>
          </div>
        </section>

        {/* Aviso importante */}
        <section className="mx-auto max-w-3xl rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="flex items-center gap-2 font-semibold text-amber-900">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Información importante
          </h2>
          <p className="mt-2 text-sm text-amber-800">
            Esta red ofrece <strong>oportunidades de trabajos eventuales</strong>.
            No constituye una promesa de empleo fijo ni garantiza una cantidad
            determinada de servicios. La asignación de trabajos depende de la
            disponibilidad, la compatibilidad de perfil y las necesidades
            operativas de FULLTECH.
          </p>
        </section>

        {/* Beneficios */}
        <section className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Trabajos en tu zona",
              desc: "Recibe servicios compatibles con tu perfil, especialidades y las zonas donde trabajas.",
              icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
            },
            {
              title: "Proceso claro",
              desc: "Registra tu perfil, sube tus documentos y sigue el estado de tu solicitud en todo momento.",
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            },
            {
              title: "Evidencias y pagos",
              desc: "Registra tu trabajo con evidencias y recibe el seguimiento de tus pagos de forma organizada.",
              icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA final */}
        <section className="mt-16 rounded-2xl bg-blue-700 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">¿Listo para formar parte de la red?</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Completa tu registro en pocos minutos. Nuestro equipo revisará tu
            solicitud y te notificará cuando tu perfil esté aprobado.
          </p>
          <Link href="/register" className="mt-6 inline-block">
            <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
              Comenzar registro
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} FULLTECH SRL. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-blue-700">Términos</Link>
            <Link href="/privacy" className="hover:text-blue-700">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
