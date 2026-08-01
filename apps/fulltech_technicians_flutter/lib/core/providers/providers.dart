import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../features/authentication/data/auth_repository.dart';
import '../../features/notifications/data/notification_repository.dart';
import '../../features/services/data/service_repository.dart';
import '../../shared/models/service.dart';
import '../networking/supabase_client.dart';


/// Proveedor del cliente Supabase.
final supabaseProvider = Provider<SupabaseClientProvider>((ref) {
  return SupabaseClientProvider.instance;
});

/// Proveedor del repositorio de autenticación.
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(supabaseProvider));
});

/// Proveedor del repositorio de servicios.
final serviceRepositoryProvider = Provider<ServiceRepository>((ref) {
  return ServiceRepository(ref.watch(supabaseProvider));
});

/// Proveedor del repositorio de notificaciones.
final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  return NotificationRepository(ref.watch(supabaseProvider));
});

/// Estado de autenticación del usuario actual.
final authStateProvider = StreamProvider<AuthState>((ref) {
  return ref.watch(supabaseProvider).authStateChanges;
});

/// Perfil del usuario actual.
final currentProfileProvider = FutureProvider((ref) async {
  final repo = ref.watch(authRepositoryProvider);
  return repo.getCurrentProfile();
});

/// Perfil de trabajador del usuario actual.
final currentWorkerProfileProvider = FutureProvider((ref) async {
  final repo = ref.watch(authRepositoryProvider);
  return repo.getCurrentWorkerProfile();
});

/// Servicios disponibles para el colaborador.
final availableServicesProvider =
    FutureProvider<List<Service>>((ref) async {
  final repo = ref.watch(serviceRepositoryProvider);
  final result = await repo.getAvailableServices();
  if (!result.success) {
    throw Exception(result.message ?? 'Error al cargar servicios.');
  }
  return result.services ?? const [];
});

/// Servicios asignados al colaborador.
final myServicesProvider = FutureProvider<List<Service>>((ref) async {
  final repo = ref.watch(serviceRepositoryProvider);
  final result = await repo.getMyServices();
  if (!result.success) {
    throw Exception(result.message ?? 'Error al cargar mis servicios.');
  }
  return result.services ?? const [];
});


/// Notificaciones del usuario actual.
final notificationsProvider = FutureProvider((ref) async {
  final repo = ref.watch(notificationRepositoryProvider);
  return repo.getNotifications();
});

/// Conteo de notificaciones no leídas.
final unreadCountProvider = FutureProvider((ref) async {
  final repo = ref.watch(notificationRepositoryProvider);
  return repo.getUnreadCount();
});
