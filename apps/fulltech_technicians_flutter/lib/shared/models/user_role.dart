/// Roles del sistema.
enum UserRole {
  superAdmin('super_admin'),
  admin('admin'),
  technician('technician'),
  helper('helper');

  const UserRole(this.value);

  final String value;

  static UserRole fromValue(String value) {
    return UserRole.values.firstWhere(
      (r) => r.value == value,
      orElse: () => UserRole.technician,
    );
  }

  bool get isAdmin => this == UserRole.admin || this == UserRole.superAdmin;

  bool get isSuperAdmin => this == UserRole.superAdmin;

  bool get isTechnician => this == UserRole.technician;

  bool get isHelper => this == UserRole.helper;
}
