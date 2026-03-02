import 'package:flutter_test/flutter_test.dart';
import 'package:betaal_app/main.dart';

void main() {
  testWidgets('App launches', (WidgetTester tester) async {
    await tester.pumpWidget(const BetaalApp());
    expect(find.text('Betaal AI'), findsWidgets);
  });
}
