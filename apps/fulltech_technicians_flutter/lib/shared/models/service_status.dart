/// Estados del ciclo de vida de un servicio.
enum ServiceStatus {
  draft('draft'),
  published('published'),
  receivingApplications('receiving_applications'),
  assigned('assigned'),
  accepted('accepted'),
  onTheWay('on_the_way'),
  arrived('arrived'),
  inProgress('in_progress'),
  paused('paused'),
  pendingEvidence('pending_evidence'),
  submittedForReview('submitted_for_review'),
  correctionRequested('correction_requested'),
  completed('completed'),
  cancelled('cancelled'),
  expired('expired');

  const ServiceStatus(this.value);

  final String value;

  static ServiceStatus fromValue(String value) {
    return ServiceStatus.values.firstWhere(
      (s) => s.value == value,
      orElse: () => ServiceStatus.draft,
    );
  }

  bool get isActive =>
      this == ServiceStatus.assigned ||
      this == ServiceStatus.accepted ||
      this == ServiceStatus.onTheWay ||
      this == ServiceStatus.arrived ||
      this == ServiceStatus.inProgress ||
      this == ServiceStatus.paused ||
      this == ServiceStatus.pendingEvidence;

  bool get isTerminal =>
      this == ServiceStatus.completed ||
      this == ServiceStatus.cancelled ||
      this == ServiceStatus.expired;

  bool get isVisibleToWorkers =>
      this == ServiceStatus.published ||
      this == ServiceStatus.receivingApplications;
}
