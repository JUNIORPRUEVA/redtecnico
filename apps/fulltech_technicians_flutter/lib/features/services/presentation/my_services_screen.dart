import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/theme/app_theme.dart';
import '../../../core/providers/providers.dart';
import '../../../shared/models/service.dart';
import '../../../shared/models/service_status.dart';

/// Pantalla de trabajos asignados al colaborador.
class MyServicesScreen extends ConsumerWidget {
  const MyServicesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final services = ref.watch(myServicesProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Mis trabajos')),
      body: services.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Text('Error: $error'),
        ),
        data: (list) {
          if (list.isEmpty) {
            return const _EmptyState();
          }
          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(myServicesProvider);
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(AppTheme.spaceMd),
              itemCount: list.length,
              itemBuilder: (context, index) {
                return _JobCard(service: list[index]);
              },
            ),
          );
        },
      ),
    );
  }
}

/// Tarjeta de trabajo asignado.
class _JobCard extends StatelessWidget {
  const _JobCard({required this.service});

  final Service service;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spaceMd),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    service.title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                          color: AppTheme.textPrimary,
                        ),
                  ),
                ),
                _StatusBadge(status: service.status),
              ],
            ),
            const SizedBox(height: AppTheme.spaceXs),
            Text(
              service.code,
              style: const TextStyle(
                color: AppTheme.textSecondary,
                fontSize: 13,
              ),
            ),
            const Divider(height: AppTheme.spaceLg),
            _InfoRow(
              icon: Icons.location_on_outlined,
              text: service.sectorId ?? 'Zona por definir',
            ),
            _InfoRow(
              icon: Icons.schedule,
              text: service.scheduledDate?.toString() ?? 'Fecha por definir',
            ),
            if (service.paymentOffered != null)
              _InfoRow(
                icon: Icons.payments_outlined,
                text: 'RD\$ ${service.paymentOffered!.toStringAsFixed(2)}',
              ),
            const SizedBox(height: AppTheme.spaceMd),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      // TODO: ver detalle del trabajo.
                    },
                    child: const Text('Ver detalle'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// Insignia de estado del servicio.
class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.status});

  final ServiceStatus status;

  @override
  Widget build(BuildContext context) {
    final (label, color) = switch (status) {
      ServiceStatus.assigned => ('Asignado', AppTheme.info),
      ServiceStatus.accepted => ('Aceptado', AppTheme.info),
      ServiceStatus.onTheWay => ('En camino', AppTheme.warning),
      ServiceStatus.arrived => ('Llegado', AppTheme.warning),
      ServiceStatus.inProgress => ('En proceso', AppTheme.primary),
      ServiceStatus.paused => ('En pausa', AppTheme.warning),
      ServiceStatus.pendingEvidence => (
          'Evidencias pendientes',
          AppTheme.warning,
        ),
      ServiceStatus.submittedForReview => (
          'En revisión',
          AppTheme.warning,
        ),
      ServiceStatus.correctionRequested => (
          'Corrección solicitada',
          AppTheme.error,
        ),
      ServiceStatus.completed => ('Completado', AppTheme.success),
      ServiceStatus.cancelled => ('Cancelado', AppTheme.error),
      _ => (status.value, AppTheme.textSecondary),
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
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

/// Fila de información.
class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppTheme.spaceXs),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppTheme.textSecondary),
          const SizedBox(width: AppTheme.spaceSm),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(color: AppTheme.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
}

/// Estado vacío.
class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.all(AppTheme.spaceLg),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.assignment_outlined,
              size: 64,
              color: AppTheme.textSecondary,
            ),
            SizedBox(height: AppTheme.spaceMd),
            Text(
              'No tienes trabajos asignados',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
              ),
            ),
            SizedBox(height: AppTheme.spaceXs),
            Text(
              'Cuando te asignen un servicio, aparecerá aquí.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppTheme.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}
