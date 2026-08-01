import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:fulltech_technicians_flutter/app/app.dart';

void main() {
  testWidgets('La app se construye correctamente', (WidgetTester tester) async {
    // Construye la app dentro de un ProviderScope y dispara un frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: RedTecnicoApp(),
      ),
    );

    // Verifica que la pantalla de inicio de sesión se muestre.
    expect(find.text('Red Técnico Fulltech'), findsOneWidget);
  });
}
