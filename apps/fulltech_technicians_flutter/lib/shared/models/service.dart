import 'service_status.dart';
import 'user_role.dart';

/// Modalidades de asignación de un servicio.
enum AssignmentMode {
  directAcceptance('direct_acceptance'),
  application('application'),
  privateAssignment('private_assignment');

  const AssignmentMode(this.value);

  final String value;

  static AssignmentMode fromValue(String value) {
    return AssignmentMode.values.firstWhere(
      (m) => m.value == value,
      orElse: () => AssignmentMode.application,
    );
  }
}

/// Tipos de servicio.
enum ServiceType {
  installation('instalación'),
  repair('reparación'),
  maintenance('mantenimiento'),
  survey('levantamiento'),
  support('soporte'),
  other('otro');

  const ServiceType(this.label);

  final String label;

  static ServiceType fromValue(String value) {
    return ServiceType.values.firstWhere(
      (t) => t.name == value,
      orElse: () => ServiceType.other,
    );
  }
}

/// Prioridad de un servicio.
enum ServicePriority {
  low('baja'),
  normal('normal'),
  high('alta'),
  urgent('urgente');

  const ServicePriority(this.label);

  final String label;

  static ServicePriority fromValue(String value) {
    return ServicePriority.values.firstWhere(
      (p) => p.name == value,
      orElse: () => ServicePriority.normal,
    );
  }
}

/// Servicio publicado por Fulltech.
class Service {
  const Service({
    required this.id,
    required this.code,
    required this.title,
    required this.description,
    required this.type,
    required this.status,
    required this.assignmentMode,
    required this.priority,
    required this.requiredRole,
    this.category,
    this.clientId,
    this.clientName,
    this.clientPhone,
    this.address,
    this.provinceId,
    this.municipalityId,
    this.sectorId,
    this.reference,
    this.latitude,
    this.longitude,
    this.googleMapsUrl,
    this.scheduledDate,
    this.scheduledTime,
    this.durationMinutes,
    this.requiredTechnicians = 1,
    this.requiredHelpers = 0,
    this.minLevel,
    this.requiredTools,
    this.materialsProvided,
    this.materialsRequired,
    this.paymentOffered,
    this.travelAllowance,
    this.paymentMethod,
    this.internalInstructions,
    this.workerInstructions,
    this.acceptanceDeadline,
    this.createdAt,
    this.updatedAt,
  });

  final String id;
  final String code;
  final String title;
  final String description;
  final ServiceType type;
  final ServiceStatus status;
  final AssignmentMode assignmentMode;
  final ServicePriority priority;
  final UserRole requiredRole;
  final String? category;
  final String? clientId;
  final String? clientName;
  final String? clientPhone;
  final String? address;
  final String? provinceId;
  final String? municipalityId;
  final String? sectorId;
  final String? reference;
  final double? latitude;
  final double? longitude;
  final String? googleMapsUrl;
  final DateTime? scheduledDate;
  final String? scheduledTime;
  final int? durationMinutes;
  final int requiredTechnicians;
  final int requiredHelpers;
  final String? minLevel;
  final List<String>? requiredTools;
  final List<String>? materialsProvided;
  final List<String>? materialsRequired;
  final double? paymentOffered;
  final double? travelAllowance;
  final String? paymentMethod;
  final String? internalInstructions;
  final String? workerInstructions;
  final DateTime? acceptanceDeadline;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'] as String,
      code: json['code'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      type: ServiceType.fromValue(json['type'] as String? ?? 'other'),
      status: ServiceStatus.fromValue(json['status'] as String? ?? 'draft'),
      assignmentMode:
          AssignmentMode.fromValue(json['assignment_mode'] as String? ?? ''),
      priority:
          ServicePriority.fromValue(json['priority'] as String? ?? 'normal'),
      requiredRole:
          UserRole.fromValue(json['required_role'] as String? ?? 'technician'),
      category: json['category'] as String?,
      clientId: json['client_id'] as String?,
      clientName: json['client_name'] as String?,
      clientPhone: json['client_phone'] as String?,
      address: json['address'] as String?,
      provinceId: json['province_id'] as String?,
      municipalityId: json['municipality_id'] as String?,
      sectorId: json['sector_id'] as String?,
      reference: json['reference'] as String?,
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      googleMapsUrl: json['google_maps_url'] as String?,
      scheduledDate:
          DateTime.tryParse(json['scheduled_date'] as String? ?? ''),
      scheduledTime: json['scheduled_time'] as String?,
      durationMinutes: json['duration_minutes'] as int?,
      requiredTechnicians: json['required_technicians'] as int? ?? 1,
      requiredHelpers: json['required_helpers'] as int? ?? 0,
      minLevel: json['min_level'] as String?,
      requiredTools: (json['required_tools'] as List?)?.cast<String>(),
      materialsProvided: (json['materials_provided'] as List?)?.cast<String>(),
      materialsRequired: (json['materials_required'] as List?)?.cast<String>(),
      paymentOffered: (json['payment_offered'] as num?)?.toDouble(),
      travelAllowance: (json['travel_allowance'] as num?)?.toDouble(),
      paymentMethod: json['payment_method'] as String?,
      internalInstructions: json['internal_instructions'] as String?,
      workerInstructions: json['worker_instructions'] as String?,
      acceptanceDeadline:
          DateTime.tryParse(json['acceptance_deadline'] as String? ?? ''),
      createdAt: DateTime.tryParse(json['created_at'] as String? ?? ''),
      updatedAt: DateTime.tryParse(json['updated_at'] as String? ?? ''),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'code': code,
      'title': title,
      'description': description,
      'type': type.name,
      'status': status.value,
      'assignment_mode': assignmentMode.value,
      'priority': priority.name,
      'required_role': requiredRole.value,
      'category': category,
      'client_id': clientId,
      'client_name': clientName,
      'client_phone': clientPhone,
      'address': address,
      'province_id': provinceId,
      'municipality_id': municipalityId,
      'sector_id': sectorId,
      'reference': reference,
      'latitude': latitude,
      'longitude': longitude,
      'google_maps_url': googleMapsUrl,
      'scheduled_date': scheduledDate?.toIso8601String(),
      'scheduled_time': scheduledTime,
      'duration_minutes': durationMinutes,
      'required_technicians': requiredTechnicians,
      'required_helpers': requiredHelpers,
      'min_level': minLevel,
      'required_tools': requiredTools,
      'materials_provided': materialsProvided,
      'materials_required': materialsRequired,
      'payment_offered': paymentOffered,
      'travel_allowance': travelAllowance,
      'payment_method': paymentMethod,
      'internal_instructions': internalInstructions,
      'worker_instructions': workerInstructions,
      'acceptance_deadline': acceptanceDeadline?.toIso8601String(),
    };
  }
}
