import 'package:supabase_flutter/supabase_flutter.dart';

import '../config/app_config.dart';

/// Cliente Supabase centralizado.
///
/// Se inicializa una sola vez en el bootstrap de la aplicación. La clave anon
/// es pública; la service_role_key nunca se usa en el cliente.
class SupabaseClientProvider {
  SupabaseClientProvider._();

  static final SupabaseClientProvider instance = SupabaseClientProvider._();

  late final SupabaseClient _client;

  /// Inicializa Supabase. Debe llamarse antes de usar la app.
  Future<void> initialize() async {
    await Supabase.initialize(
      url: AppConfig.supabaseUrl,
      publishableKey: AppConfig.supabaseAnonKey,
    );

    _client = Supabase.instance.client;
  }

  /// Cliente Supabase.
  SupabaseClient get client => _client;

  /// Usuario autenticado actual.
  User? get currentUser => _client.auth.currentUser;

  /// Sesión actual.
  Session? get currentSession => _client.auth.currentSession;

  /// Stream de cambios de autenticación.
  Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;

  /// Cierra la sesión.
  Future<void> signOut() => _client.auth.signOut();
}
