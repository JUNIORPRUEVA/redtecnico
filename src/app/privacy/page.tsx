import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Política de privacidad</h1>
        <p className="mt-2 text-sm text-gray-500">Última actualización: {new Date().toLocaleDateString("es-DO")}</p>

        <div className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Datos que recopilamos</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Recopilamos la información que proporcionas al registrarte: nombre,
              apellidos, correo electrónico, teléfono, cédula, dirección, datos de
              experiencia, documentos de identificación y evidencias de trabajo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Uso de la información</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Utilizamos tu información para gestionar tu perfil, evaluar tu solicitud,
              asignar servicios compatibles, registrar tu trabajo y procesar pagos.
              Tus documentos sensibles solo son visibles para el equipo administrativo
              de FULLTECH.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Almacenamiento y seguridad</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Tus datos se almacenan de forma segura en la nube con cifrado y controles
              de acceso. Los documentos sensibles se guardan en almacenamiento privado
              con acceso restringido y URLs firmadas de duración limitada.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Compartir información</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              No vendemos ni compartimos tu información personal con terceros, salvo
              cuando sea necesario para la operación de los servicios o lo exija la ley.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Tus derechos</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Puedes solicitar acceso, corrección o eliminación de tus datos personales
              contactando al equipo de FULLTECH.
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
