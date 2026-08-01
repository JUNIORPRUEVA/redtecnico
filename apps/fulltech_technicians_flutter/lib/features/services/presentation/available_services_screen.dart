import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/theme/app_theme.dart';
import '../../../core/providers/providers.dart';
import '../../../shared/models/service.dart';

/// Pantalla de servicios disponibles para el colaborador.
class AvailableServicesScreen extends ConsumerWidget {
  const AvailableServicesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final services = ref.watch(availableServicesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Servicios disponibles'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            tooltip: 'Filtrar',
            onPressed: () {
              // TODO: abrir bottom sheet de filtros.
            },
          ),
        ],
      ),
      body: services.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => _ErrorState(message: '$error'),
        data: (list) {
          if (list.isEmpty) {
            return const _EmptyState();
          }
          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(availableServicesProvider);
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(AppTheme.spaceMd),
              itemCount: list.length,
              itemBuilder: (context, index) {
                return _ServiceCard(service: list[index]);
              },
            ),
          );
        },
      ),
    );
  }
}

/// Tarjeta de servicio disponible.
class _ServiceCard extends StatelessWidget {
  const _ServiceCard({required this.service});

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
                _PriorityBadge(priority: service.priority),
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
              icon: Icons.category_outlined,
              text: service.type.label,
            ),
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
                      // TODO: ver detalle del servicio.
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

/// Insignia de prioridad.
class _PriorityBadge extends StatelessWidget {
  const _PriorityBadge({required this.priority});

  final ServicePriority priority;

  @override
  Widget build(BuildContext context) {
    final color = switch (priority) {
      ServicePriority.low => AppTheme.success,
      ServicePriority.normal => AppTheme.info,
      ServicePriority.high => AppTheme.warning,
      ServicePriority.urgent => AppTheme.error,
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
        priority.label,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
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
              Icons.work_off_outlined,
              size: 64,
              color: AppTheme.textSecondary,
            ),
            SizedBox(height: AppTheme.spaceMd),
            Text(
              'No hay servicios disponibles',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
              ),
            ),
            SizedBox(height: AppTheme.spaceXs),
            Text(
              'Cuando Fulltech publique servicios compatibles con tu perfil, aparecerán aquí.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppTheme.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}

/// Estado de error.
class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spaceLg),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: AppTheme.error,
            ),
            const SizedBox(height: AppTheme.spaceMd),
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
