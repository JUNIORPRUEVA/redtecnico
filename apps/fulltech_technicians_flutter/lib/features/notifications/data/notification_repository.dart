import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../core/networking/supabase_client.dart';

/// Notificación interna.
class AppNotification {
  const AppNotification({
    required this.id,
    required this.userId,
    required this.title,
    required this.body,
    required this.type,
    required this.isRead,
    this.data,
    this.createdAt,
  });

  final String id;
  final String userId;
  final String title;
  final String body;
  final String type;
  final bool isRead;
  final Map<String, dynamic>? data;
  final DateTime? createdAt;

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      title: json['title'] as String? ?? '',
      body: json['body'] as String? ?? '',
      type: json['type'] as String? ?? 'general',
      isRead: json['is_read'] as bool? ?? false,
      data: json['data'] as Map<String, dynamic>?,
      createdAt: DateTime.tryParse(json['created_at'] as String? ?? ''),
    );
  }
}

/// Repositorio de notificaciones internas.
class NotificationRepository {
  NotificationRepository(this._supabase);

  final SupabaseClientProvider _supabase;

  SupabaseClient get _client => _supabase.client;

  /// Obtiene las notificaciones del usuario actual.
  Future<List<AppNotification>> getNotifications() async {
    final user = _supabase.currentUser;
    if (user == null) return const [];
    final response = await _client
        .from('notifications')
        .select()
        .eq('user_id', user.id)
        .order('created_at', ascending: false)
        .limit(50);
    return (response as List)
        .map((e) => AppNotification.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// Obtiene el conteo de notificaciones no leídas.
  Future<int> getUnreadCount() async {
    final user = _supabase.currentUser;
    if (user == null) return 0;
    final response = await _client
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_read', false);
    return (response as List).length;
  }

  /// Marca una notificación como leída.
  Future<void> markAsRead(String notificationId) async {
    await _client
        .from('notifications')
        .update({'is_read': true})
        .eq('id', notificationId);
  }

  /// Marca todas las notificaciones como leídas.
  Future<void> markAllAsRead() async {
    final user = _supabase.currentUser;
    if (user == null) return;
    await _client
        .from('notifications')
        .update({'is_read': true})
        .eq('user_id', user.id)
        .eq('is_read', false);
  }
}
