import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/app.dart';
import 'core/networking/supabase_client.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Inicializa Supabase antes de montar la app.
  await SupabaseClientProvider.instance.initialize();

  runApp(const ProviderScope(child: RedTecnicoApp()));
}
