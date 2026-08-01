import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Términos y condiciones</h1>
        <p className="mt-2 text-sm text-gray-500">Última actualización: {new Date().toLocaleDateString("es-DO")}</p>

        <div className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Naturaleza de la red</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              La Red Técnico Fulltech es una plataforma de FULLTECH SRL que conecta a
              técnicos y ayudantes aliados con oportunidades de trabajos eventuales de
              instalación, mantenimiento, reparación y soporte técnico. La participación
              en la red no constituye una relación laboral, un empleo fijo ni una
              promesa de cantidad garantizada de servicios.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Registro y aprobación</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Todo colaborador debe completar su registro y ser aprobado por el equipo
              administrativo de FULLTECH antes de poder ver o aceptar servicios. FULLTECH
              se reserva el derecho de aprobar, rechazar, suspender o desactivar perfiles
              según su criterio y las necesidades operativas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Asignación de servicios</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              La asignación de servicios depende de la compatibilidad del perfil, la
              disponibilidad, las zonas de trabajo y las necesidades de FULLTECH. No se
              garantiza la asignación de ningún servicio en particular.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Responsabilidad del colaborador</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              El colaborador es responsable de realizar los trabajos asignados con
              calidad, registrar las evidencias requeridas y cumplir con las instrucciones
              de FULLTECH. El incumplimiento puede resultar en la suspensión o desactivación
              del perfil.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Pagos</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Los pagos se registran según los términos acordados para cada servicio.
              FULLTECH procesará los pagos de acuerdo con sus políticas internas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Modificaciones</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              FULLTECH puede modificar estos términos en cualquier momento. Los cambios
              serán notificados a través de la plataforma.
            </p>
          </section>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/" className="font-medium text-blue-700 hover:underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
