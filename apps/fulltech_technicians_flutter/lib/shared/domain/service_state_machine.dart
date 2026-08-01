import '../models/service_status.dart';
import '../models/user_role.dart';

/// Resultado de una transición de estado.
class TransitionResult {
  const TransitionResult({
    required this.allowed,
    this.reason,
  });

  final bool allowed;
  final String? reason;

  factory TransitionResult.ok() => const TransitionResult(allowed: true);

  factory TransitionResult.denied(String reason) =>
      TransitionResult(allowed: false, reason: reason);
}

/// Máquina de estados centralizada para servicios.
///
/// Define las transiciones permitidas por rol. El backend (Supabase RPC)
/// valida estas mismas reglas; esta clase es la fuente de verdad en el cliente
/// para habilitar/deshabilitar acciones y mostrar mensajes claros.
class ServiceStateMachine {
  const ServiceStateMachine._();

  /// Verifica si una transición es permitida para un rol.
  static TransitionResult canTransition({
    required ServiceStatus from,
    required ServiceStatus to,
    required UserRole role,
  }) {
    // Solo admin/superAdmin pueden gestionar estados administrativos.
    if (_isAdminTransition(from, to) && !role.isAdmin) {
      return TransitionResult.denied(
        'Solo un administrador puede realizar esta acción.',
      );
    }

    // Transiciones del colaborador.
    if (_isWorkerTransition(from, to) && !role.isTechnician && !role.isHelper) {
      return TransitionResult.denied(
        'Solo un colaborador asignado puede realizar esta acción.',
      );
    }

    final allowed = _transitions[from]?.contains(to) ?? false;
    if (!allowed) {
      return TransitionResult.denied(
        'No se permite pasar de "${from.value}" a "${to.value}".',
      );
    }

    return TransitionResult.ok();
  }

  /// Transiciones permitidas desde cada estado.
  static const Map<ServiceStatus, Set<ServiceStatus>> _transitions = {
    ServiceStatus.draft: {
      ServiceStatus.published,
      ServiceStatus.cancelled,
    },
    ServiceStatus.published: {
      ServiceStatus.receivingApplications,
      ServiceStatus.assigned,
      ServiceStatus.cancelled,
      ServiceStatus.expired,
    },
    ServiceStatus.receivingApplications: {
      ServiceStatus.assigned,
      ServiceStatus.published,
      ServiceStatus.cancelled,
      ServiceStatus.expired,
    },
    ServiceStatus.assigned: {
      ServiceStatus.accepted,
      ServiceStatus.cancelled,
    },
    ServiceStatus.accepted: {
      ServiceStatus.onTheWay,
      ServiceStatus.cancelled,
    },
    ServiceStatus.onTheWay: {
      ServiceStatus.arrived,
      ServiceStatus.cancelled,
    },
    ServiceStatus.arrived: {
      ServiceStatus.inProgress,
      ServiceStatus.cancelled,
    },
    ServiceStatus.inProgress: {
      ServiceStatus.paused,
      ServiceStatus.pendingEvidence,
      ServiceStatus.submittedForReview,
      ServiceStatus.cancelled,
    },
    ServiceStatus.paused: {
      ServiceStatus.inProgress,
      ServiceStatus.cancelled,
    },
    ServiceStatus.pendingEvidence: {
      ServiceStatus.submittedForReview,
      ServiceStatus.inProgress,
    },
    ServiceStatus.submittedForReview: {
      ServiceStatus.completed,
      ServiceStatus.correctionRequested,
    },
    ServiceStatus.correctionRequested: {
      ServiceStatus.submittedForReview,
      ServiceStatus.cancelled,
    },
    ServiceStatus.completed: {},
    ServiceStatus.cancelled: {},
    ServiceStatus.expired: {},
  };

  /// Transiciones que solo puede realizar un administrador.
  static bool _isAdminTransition(ServiceStatus from, ServiceStatus to) {
    return (from == ServiceStatus.draft && to == ServiceStatus.published) ||
        (from == ServiceStatus.published &&
            to == ServiceStatus.receivingApplications) ||
        (from == ServiceStatus.receivingApplications &&
            to == ServiceStatus.published) ||
        (from == ServiceStatus.submittedForReview &&
            (to == ServiceStatus.completed ||
                to == ServiceStatus.correctionRequested));
  }

  /// Transiciones que realiza el colaborador asignado.
  static bool _isWorkerTransition(ServiceStatus from, ServiceStatus to) {
    return (from == ServiceStatus.assigned && to == ServiceStatus.accepted) ||
        (from == ServiceStatus.accepted && to == ServiceStatus.onTheWay) ||
        (from == ServiceStatus.onTheWay && to == ServiceStatus.arrived) ||
        (from == ServiceStatus.arrived && to == ServiceStatus.inProgress) ||
        (from == ServiceStatus.inProgress &&
            (to == ServiceStatus.paused ||
                to == ServiceStatus.pendingEvidence ||
                to == ServiceStatus.submittedForReview)) ||
        (from == ServiceStatus.paused && to == ServiceStatus.inProgress) ||
        (from == ServiceStatus.pendingEvidence &&
            (to == ServiceStatus.submittedForReview ||
                to == ServiceStatus.inProgress)) ||
        (from == ServiceStatus.correctionRequested &&
            to == ServiceStatus.submittedForReview);
  }

  /// Devuelve los estados siguientes permitidos para un rol.
  static List<ServiceStatus> nextStates(
    ServiceStatus from,
    UserRole role,
  ) {
    final candidates = _transitions[from] ?? const <ServiceStatus>{};
    return candidates.where((to) {
      return canTransition(from: from, to: to, role: role).allowed;
    }).toList();
  }
}
