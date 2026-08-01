import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/theme/app_theme.dart';
import '../../../core/providers/providers.dart';
import '../../../shared/models/worker_status.dart';

/// Pantalla de perfil del colaborador.
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(currentProfileProvider).valueOrNull;
    final worker = ref.watch(currentWorkerProfileProvider).valueOrNull;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Perfil'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Cerrar sesión',
            onPressed: () {
              ref.read(authRepositoryProvider).signOut();
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppTheme.spaceMd),
        children: [
          // Encabezado del perfil.
          Card(
            child: Padding(
              padding: const EdgeInsets.all(AppTheme.spaceLg),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: AppTheme.primaryLight,
                    child: Text(
                      _initials(profile?.firstName, profile?.lastName),
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.primary,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppTheme.spaceMd),
                  Text(
                    '${profile?.firstName ?? ''} ${profile?.lastName ?? ''}'
                        .trim(),
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary,
                        ),
                  ),
                  const SizedBox(height: AppTheme.spaceXs),
                  Text(
                    profile?.email ?? '',
                    style: const TextStyle(color: AppTheme.textSecondary),
                  ),
                  const SizedBox(height: AppTheme.spaceMd),
                  _StatusChip(status: worker?.status ?? WorkerStatus.draft),
                ],
              ),
            ),
          ),

          // Información del perfil de trabajador.
          if (worker != null) ...[
            const SizedBox(height: AppTheme.spaceMd),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppTheme.spaceLg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Información del colaborador',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                    const SizedBox(height: AppTheme.spaceMd),
                    _InfoRow(
                      label: 'Rol',
                      value: worker.role.value,
                    ),
                    _InfoRow(
                      label: 'Nivel',
                      value: worker.level ?? 'Sin definir',
                    ),
                    _InfoRow(
                      label: 'Experiencia',
                      value: '${worker.yearsExperience ?? 0} años',
                    ),

                    _InfoRow(
                      label: 'Disponible',
                      value: worker.isAvailable ? 'Sí' : 'No',
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _initials(String? first, String? last) {
    final f = first?.isNotEmpty == true ? first![0] : '';
    final l = last?.isNotEmpty == true ? last![0] : '';
    return '$f$l'.toUpperCase();
  }
}

/// Chip de estado del perfil.
class _StatusChip extends StatelessWidget {
  const _StatusChip({required this.status});

  final WorkerStatus status;

  @override
  Widget build(BuildContext context) {
    final (label, color, icon) = switch (status) {
      WorkerStatus.approved => ('Aprobado', AppTheme.success, Icons.check_circle),
      WorkerStatus.pendingReview => (
          'En revisión',
          AppTheme.warning,
          Icons.hourglass_top,
        ),
      WorkerStatus.rejected => ('Rechazado', AppTheme.error, Icons.cancel),
      WorkerStatus.suspended => (
          'Suspendido',
          AppTheme.error,
          Icons.block,
        ),
      WorkerStatus.inactive => (
          'Inactivo',
          AppTheme.textSecondary,
          Icons.pause_circle,
        ),
      WorkerStatus.draft => (
          'Borrador',
          AppTheme.textSecondary,
          Icons.edit,
        ),
    };

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppTheme.spaceSm,
        vertical: AppTheme.spaceXs,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(AppTheme.radiusSm),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: AppTheme.spaceXs),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}

/// Fila de información.
class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppTheme.spaceXs),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(color: AppTheme.textSecondary),
          ),
          Text(
            value,
            style: const TextStyle(
              color: AppTheme.textPrimary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
