import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/providers/providers.dart';
import '../features/authentication/presentation/login_screen.dart';
import '../features/home/presentation/home_shell.dart';

import 'theme/app_theme.dart';

/// Widget raíz de la aplicación.
class RedTecnicoApp extends ConsumerWidget {
  const RedTecnicoApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);

    return MaterialApp(
      title: 'Red Técnico Fulltech',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      home: authState.when(
        data: (state) {
          final session = state.session;
          if (session != null) {
            return const HomeShell();
          }
          return const LoginScreen();
        },
        loading: () => const _SplashScreen(),
        error: (_, _) => const LoginScreen(),

      ),
    );
  }
}

/// Pantalla de carga inicial.
class _SplashScreen extends StatelessWidget {
  const _SplashScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
