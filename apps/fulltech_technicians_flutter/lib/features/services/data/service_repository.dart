import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../core/networking/supabase_client.dart';
import '../../../shared/models/service.dart';
import '../../../shared/models/service_status.dart';

/// Resultado de una operación sobre servicios.
class ServiceResult {
  const ServiceResult({
    required this.success,
    this.message,
    this.service,
    this.services,
  });

  final bool success;
  final String? message;
  final Service? service;
  final List<Service>? services;

  factory ServiceResult.ok(Service service) =>
      ServiceResult(success: true, service: service);

  factory ServiceResult.okList(List<Service> services) =>
      ServiceResult(success: true, services: services);

  factory ServiceResult.fail(String message) =>
      ServiceResult(success: false, message: message);
}

/// Repositorio de servicios.
class ServiceRepository {
  ServiceRepository(this._supabase);

  final SupabaseClientProvider _supabase;

  SupabaseClient get _client => _supabase.client;

  /// Obtiene los servicios disponibles para el colaborador actual.
  Future<ServiceResult> getAvailableServices() async {
    try {
      final response = await _client.rpc<List<dynamic>>('get_available_services');

      final list = response
          .map((e) => Service.fromJson(e as Map<String, dynamic>))
          .toList();

      return ServiceResult.okList(list);
    } catch (e) {
      return ServiceResult.fail('Error al cargar servicios: $e');
    }
  }

  /// Obtiene los servicios asignados al colaborador actual.
  Future<ServiceResult> getMyServices() async {
    try {
      final response = await _client.rpc<List<dynamic>>('get_my_services');

      final list = response
          .map((e) => Service.fromJson(e as Map<String, dynamic>))
          .toList();

      return ServiceResult.okList(list);
    } catch (e) {
      return ServiceResult.fail('Error al cargar mis servicios: $e');
    }
  }

  /// Obtiene el detalle de un servicio.
  Future<ServiceResult> getService(String serviceId) async {
    try {
      final response = await _client
          .from('services')
          .select()
          .eq('id', serviceId)
          .maybeSingle();
      if (response == null) {
        return ServiceResult.fail('Servicio no encontrado.');
      }

      return ServiceResult.ok(Service.fromJson(response));
    } catch (e) {
      return ServiceResult.fail('Error al cargar el servicio: $e');
    }
  }

  /// Acepta un servicio de aceptación directa de forma atómica.
  ///
  /// La lógica transaccional se ejecuta en el servidor (RPC) para evitar
  /// asignaciones dobles cuando dos técnicos aceptan simultáneamente.
  Future<ServiceResult> acceptService(String serviceId) async {
    try {
      final response = await _client.rpc<Map<String, dynamic>>(
        'accept_service',
        params: {'p_service_id': serviceId},
      );

      final result = response;
      if (result['success'] == true) {
        final service = await getService(serviceId);
        return service;
      }
      return ServiceResult.fail(
        result['message'] as String? ?? 'No se pudo aceptar el servicio.',
      );

    } catch (e) {
      return ServiceResult.fail('Error al aceptar el servicio: $e');
    }
  }

  /// Envía una solicitud para un servicio en modalidad application.
  Future<ServiceResult> applyToService({
    required String serviceId,
    String? message,
    String? estimatedArrival,
    bool confirmTools = false,
    bool confirmAvailability = false,
    bool needsHelper = false,
  }) async {
    try {
      await _client.from('service_applications').insert({
        'service_id': serviceId,
        'message': message,
        'estimated_arrival': estimatedArrival,
        'confirm_tools': confirmTools,
        'confirm_availability': confirmAvailability,
        'needs_helper': needsHelper,
      });
      return const ServiceResult(
        success: true,
        message: 'Solicitud enviada correctamente.',
      );
    } catch (e) {
      return ServiceResult.fail('Error al enviar la solicitud: $e');
    }
  }

  /// Cambia el estado de un servicio mediante la máquina de estados.
  Future<ServiceResult> transitionStatus({
    required String serviceId,
    required ServiceStatus to,
    String? comment,
  }) async {
    try {
      final response = await _client.rpc<Map<String, dynamic>>(
        'transition_service_status',
        params: {
          'p_service_id': serviceId,
          'p_to_status': to.value,
          'p_comment': comment,
        },
      );

      final result = response;
      if (result['success'] == true) {
        final service = await getService(serviceId);
        return service;
      }
      return ServiceResult.fail(
        result['message'] as String? ?? 'No se pudo cambiar el estado.',
      );

    } catch (e) {
      return ServiceResult.fail('Error al cambiar el estado: $e');
    }
  }
}
