import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../core/networking/supabase_client.dart';
import '../../../shared/models/profile.dart';
import '../../../shared/models/user_role.dart';
import '../../../shared/models/worker_profile.dart';
import '../../../shared/models/worker_status.dart';

/// Resultado de una operación de autenticación.
class AuthResult {
  const AuthResult({
    required this.success,
    this.message,
    this.profile,
    this.workerProfile,
  });

  final bool success;
  final String? message;
  final Profile? profile;
  final WorkerProfile? workerProfile;
}

/// Repositorio de autenticación y registro.
class AuthRepository {
  AuthRepository(this._supabase);

  final SupabaseClientProvider _supabase;

  SupabaseClient get _client => _supabase.client;

  /// Inicia sesión con correo y contraseña.
  Future<AuthResult> signIn({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _client.auth.signInWithPassword(
        email: email,
        password: password,
      );
      final user = response.user;
      if (user == null) {
        return const AuthResult(
          success: false,
          message: 'No se pudo iniciar sesión.',
        );
      }
      final profile = await _fetchProfile(user.id);
      final worker = await _fetchWorkerProfile(user.id);
      return AuthResult(
        success: true,
        profile: profile,
        workerProfile: worker,
      );
    } on AuthException catch (e) {
      return AuthResult(success: false, message: e.message);
    } catch (e) {
      return AuthResult(
        success: false,
        message: 'Error al iniciar sesión: $e',
      );
    }
  }

  /// Registra un nuevo usuario y crea su perfil.
  Future<AuthResult> signUp({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String phone,
  }) async {
    try {
      final response = await _client.auth.signUp(
        email: email,
        password: password,
        data: {
          'first_name': firstName,
          'last_name': lastName,
          'phone': phone,
        },
      );
      final user = response.user;
      if (user == null) {
        return const AuthResult(
          success: false,
          message: 'No se pudo crear la cuenta.',
        );
      }

      // Crear perfil básico.
      await _client.from('profiles').insert({
        'user_id': user.id,
        'first_name': firstName,
        'last_name': lastName,
        'email': email,
        'phone': phone,
        'role': UserRole.technician.value,
      });

      // Crear perfil de trabajador en estado draft.
      await _client.from('worker_profiles').insert({
        'user_id': user.id,
        'role': UserRole.technician.value,
        'status': WorkerStatus.draft.value,
      });

      return AuthResult(
        success: true,
        profile: Profile(
          id: user.id,
          userId: user.id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
        ),
      );
    } on AuthException catch (e) {
      return AuthResult(success: false, message: e.message);
    } catch (e) {
      return AuthResult(
        success: false,
        message: 'Error al crear la cuenta: $e',
      );
    }
  }

  /// Envía un correo de recuperación de contraseña.
  Future<AuthResult> resetPassword(String email) async {
    try {
      await _client.auth.resetPasswordForEmail(email);
      return const AuthResult(
        success: true,
        message: 'Se envió un enlace de recuperación a tu correo.',
      );
    } on AuthException catch (e) {
      return AuthResult(success: false, message: e.message);
    } catch (e) {
      return AuthResult(
        success: false,
        message: 'Error al enviar recuperación: $e',
      );
    }
  }

  /// Cierra la sesión.
  Future<void> signOut() => _supabase.signOut();

  /// Obtiene el perfil del usuario actual.
  Future<Profile?> getCurrentProfile() async {
    final user = _supabase.currentUser;
    if (user == null) return null;
    return _fetchProfile(user.id);
  }

  /// Obtiene el perfil de trabajador del usuario actual.
  Future<WorkerProfile?> getCurrentWorkerProfile() async {
    final user = _supabase.currentUser;
    if (user == null) return null;
    return _fetchWorkerProfile(user.id);
  }

  Future<Profile?> _fetchProfile(String userId) async {
    final response = await _client
        .from('profiles')
        .select()
        .eq('user_id', userId)
        .maybeSingle();
    if (response == null) return null;
    return Profile.fromJson(response);
  }

  Future<WorkerProfile?> _fetchWorkerProfile(String userId) async {
    final response = await _client
        .from('worker_profiles')
        .select()
        .eq('user_id', userId)
        .maybeSingle();
    if (response == null) return null;
    return WorkerProfile.fromJson(response);
  }
}
