import 'user_role.dart';
import 'worker_status.dart';

/// Perfil operativo de un colaborador (técnico o ayudante).
class WorkerProfile {
  const WorkerProfile({
    required this.id,
    required this.userId,
    required this.role,
    required this.status,
    this.cedula,
    this.birthDate,
    this.address,
    this.provinceId,
    this.municipalityId,
    this.sectorId,
    this.latitude,
    this.longitude,
    this.yearsExperience,
    this.experienceDescription,
    this.level,
    this.hasVehicle,
    this.vehicleType,
    this.hasTools,
    this.tools,
    this.canWorkAsHelper,
    this.canLeadInstallation,
    this.canTravel,
    this.maxDistanceKm,
    this.isAvailable = false,
    this.rating,
    this.rejectionReason,
    this.createdAt,
    this.updatedAt,
  });

  final String id;
  final String userId;
  final UserRole role;
  final WorkerStatus status;
  final String? cedula;
  final DateTime? birthDate;
  final String? address;
  final String? provinceId;
  final String? municipalityId;
  final String? sectorId;
  final double? latitude;
  final double? longitude;
  final int? yearsExperience;
  final String? experienceDescription;
  final String? level;
  final bool? hasVehicle;
  final String? vehicleType;
  final bool? hasTools;
  final List<String>? tools;
  final bool? canWorkAsHelper;
  final bool? canLeadInstallation;
  final bool? canTravel;
  final double? maxDistanceKm;
  final bool isAvailable;
  final double? rating;
  final String? rejectionReason;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  factory WorkerProfile.fromJson(Map<String, dynamic> json) {
    return WorkerProfile(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      role: UserRole.fromValue(json['role'] as String? ?? 'technician'),
      status: WorkerStatus.fromValue(json['status'] as String? ?? 'draft'),
      cedula: json['cedula'] as String?,
      birthDate: DateTime.tryParse(json['birth_date'] as String? ?? ''),
      address: json['address'] as String?,
      provinceId: json['province_id'] as String?,
      municipalityId: json['municipality_id'] as String?,
      sectorId: json['sector_id'] as String?,
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      yearsExperience: json['years_experience'] as int?,
      experienceDescription: json['experience_description'] as String?,
      level: json['level'] as String?,
      hasVehicle: json['has_vehicle'] as bool?,
      vehicleType: json['vehicle_type'] as String?,
      hasTools: json['has_tools'] as bool?,
      tools: (json['tools'] as List?)?.cast<String>(),
      canWorkAsHelper: json['can_work_as_helper'] as bool?,
      canLeadInstallation: json['can_lead_installation'] as bool?,
      canTravel: json['can_travel'] as bool?,
      maxDistanceKm: (json['max_distance_km'] as num?)?.toDouble(),
      isAvailable: json['is_available'] as bool? ?? false,
      rating: (json['rating'] as num?)?.toDouble(),
      rejectionReason: json['rejection_reason'] as String?,
      createdAt: DateTime.tryParse(json['created_at'] as String? ?? ''),
      updatedAt: DateTime.tryParse(json['updated_at'] as String? ?? ''),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'role': role.value,
      'status': status.value,
      'cedula': cedula,
      'birth_date': birthDate?.toIso8601String(),
      'address': address,
      'province_id': provinceId,
      'municipality_id': municipalityId,
      'sector_id': sectorId,
      'latitude': latitude,
      'longitude': longitude,
      'years_experience': yearsExperience,
      'experience_description': experienceDescription,
      'level': level,
      'has_vehicle': hasVehicle,
      'vehicle_type': vehicleType,
      'has_tools': hasTools,
      'tools': tools,
      'can_work_as_helper': canWorkAsHelper,
      'can_lead_installation': canLeadInstallation,
      'can_travel': canTravel,
      'max_distance_km': maxDistanceKm,
      'is_available': isAvailable,
      'rating': rating,
      'rejection_reason': rejectionReason,
    };
  }
}
