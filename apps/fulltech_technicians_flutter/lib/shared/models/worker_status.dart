/// Estados posibles del perfil operativo de un colaborador.
enum WorkerStatus {
  draft('draft'),
  pendingReview('pending_review'),
  approved('approved'),
  rejected('rejected'),
  suspended('suspended'),
  inactive('inactive');

  const WorkerStatus(this.value);

  final String value;

  static WorkerStatus fromValue(String value) {
    return WorkerStatus.values.firstWhere(
      (s) => s.value == value,
      orElse: () => WorkerStatus.draft,
    );
  }

  bool get canOperate => this == WorkerStatus.approved;

  bool get isPending => this == WorkerStatus.pendingReview;

  bool get isRejected => this == WorkerStatus.rejected;

  bool get isSuspended => this == WorkerStatus.suspended;
}
