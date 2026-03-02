import 'package:flutter_test/flutter_test.dart';
import 'package:betaal_app/main.dart';

void main() {
  testWidgets('App launches', (WidgetTester tester) async {
    await tester.pumpWidget(const BetaalTestApp());
    expect(find.text('Betaal AI — Phase 1'), findsOneWidget);
  });
}
