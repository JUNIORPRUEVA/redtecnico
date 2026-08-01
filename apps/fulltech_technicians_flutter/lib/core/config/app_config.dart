/// Configuración central de la aplicación.
///
/// Los valores sensibles se inyectan mediante `--dart-define` en tiempo de
/// compilación. Nunca se incluyen secretos del servidor en el cliente.
class AppConfig {
  const AppConfig._();

  /// URL del proyecto Supabase.
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://TU-PROYECTO.supabase.co',
  );

  /// Clave pública (anon key) de Supabase. No es un secreto.
  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'TU-ANON-KEY',
  );

  /// Nombre de la aplicación.
  static const String appName = 'Red Técnico Fulltech';

  /// Nombre corto para la PWA.
  static const String appShortName = 'Red Fulltech';

  /// Zona horaria oficial.
  static const String timeZone = 'America/Santo_Domingo';

  /// Moneda local.
  static const String currencyCode = 'DOP';

  /// Símbolo de moneda.
  static const String currencySymbol = 'RD\$';

  /// Locale por defecto.
  static const String locale = 'es_DO';

  /// Buckets de almacenamiento.
  static const String bucketProfileImages = 'profile-images';
  static const String bucketWorkerDocuments = 'worker-documents';
  static const String bucketServiceAttachments = 'service-attachments';
  static const String bucketServiceEvidence = 'service-evidence';
  static const String bucketPaymentReceipts = 'payment-receipts';

  /// Límites de archivos.
  static const int maxImageSizeMb = 5;
  static const int maxDocumentSizeMb = 10;
  static const int maxUploadRetries = 3;

  /// Duración de URLs firmadas (segundos).
  static const int signedUrlExpirySeconds = 3600;

  /// Versión de la aplicación.
  static const String appVersion = '1.0.0';
}
