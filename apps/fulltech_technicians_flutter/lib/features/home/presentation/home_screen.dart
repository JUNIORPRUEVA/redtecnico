import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/theme/app_theme.dart';
import '../../../core/providers/providers.dart';
import '../../../shared/models/worker_status.dart';

/// Pantalla de inicio del colaborador.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(currentProfileProvider).valueOrNull;
    final worker = ref.watch(currentWorkerProfileProvider).valueOrNull;
    final myServices = ref.watch(myServicesProvider).valueOrNull ?? const [];

    final activeJobs = myServices.where((s) => s.status.isActive).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inicio'),
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
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(currentProfileProvider);
          ref.invalidate(currentWorkerProfileProvider);
          ref.invalidate(myServicesProvider);
        },
        child: ListView(
          padding: const EdgeInsets.all(AppTheme.spaceMd),
          children: [
            // Saludo y estado.
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppTheme.spaceLg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hola, ${profile?.firstName ?? 'colaborador'}',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.w700,
                            color: AppTheme.textPrimary,
                          ),
                    ),
                    const SizedBox(height: AppTheme.spaceSm),
                    _StatusChip(status: worker?.status ?? WorkerStatus.draft),
                  ],
                ),
              ),
            ),

            // Acciones rápidas.
            const SizedBox(height: AppTheme.spaceMd),
            Row(
              children: [
                Expanded(
                  child: _QuickActionCard(
                    icon: Icons.work_outline,
                    label: 'Servicios',
                    value: '${myServices.length}',
                    onTap: () {},
                  ),
                ),
                const SizedBox(width: AppTheme.spaceMd),
                Expanded(
                  child: _QuickActionCard(
                    icon: Icons.assignment_outlined,
                    label: 'Trabajos activos',
                    value: '$activeJobs',
                    onTap: () {},
                  ),
                ),
              ],
            ),

            // Disponibilidad.
            const SizedBox(height: AppTheme.spaceMd),
            Card(
              child: SwitchListTile(
                value: worker?.isAvailable ?? false,
                onChanged: (value) {
                  // TODO: persistir disponibilidad.
                },
                title: const Text('Disponible para trabajar'),
                subtitle: const Text(
                  'Activa tu disponibilidad para recibir servicios.',
                ),
                secondary: const Icon(Icons.toggle_on_outlined),
              ),
            ),

            // Próximo servicio.
            const SizedBox(height: AppTheme.spaceMd),
            Text(
              'Próximo servicio',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
            ),
            const SizedBox(height: AppTheme.spaceSm),
            if (myServices.isEmpty)
              const _EmptyState(
                icon: Icons.event_available,
                message: 'No tienes servicios asignados.',
              )
            else
              ...myServices.take(2).map(
                    (s) => Card(
                      child: ListTile(
                        leading: const Icon(
                          Icons.work,
                          color: AppTheme.primary,
                        ),
                        title: Text(s.title),
                        subtitle: Text(s.code),
                        trailing: const Icon(Icons.chevron_right),
                        onTap: () {},
                      ),
                    ),
                  ),
          ],
        ),
      ),
    );
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

/// Tarjeta de acción rápida.
class _QuickActionCard extends StatelessWidget {
  const _QuickActionCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final String value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(AppTheme.spaceMd),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: AppTheme.primary),
              const SizedBox(height: AppTheme.spaceSm),
              Text(
                value,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary,
                    ),
              ),
              Text(
                label,
                style: const TextStyle(
                  color: AppTheme.textSecondary,
                  fontSize: 13,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Estado vacío.
class _EmptyState extends StatelessWidget {
  const _EmptyState({required this.icon, required this.message});

  final IconData icon;
  final String message;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spaceLg),
        child: Column(
          children: [
            Icon(icon, size: 48, color: AppTheme.textSecondary),
            const SizedBox(height: AppTheme.spaceSm),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppTheme.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}
