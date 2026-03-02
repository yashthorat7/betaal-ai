import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../core/constants.dart';
import '../services/stealth_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _stealthMode = 'default';
  int _addictionLevel = 8;
  int _strictness = 3;
  int _cooldownMin = 10;
  bool _dailySummary = true;
  bool _milestoneAlerts = true;
  bool _rehabReminders = false;
  String _language = 'English';

  int get _rehabDays {
    final days = _addictionLevel * 3 * (6 - _strictness);
    return days.clamp(7, 90);
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;

    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text('Settings', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),

            // Stealth Mode
            const Text('Stealth Mode', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    DropdownButtonFormField<String>(
                      value: _stealthMode,
                      decoration: const InputDecoration(labelText: 'Disguise as', border: OutlineInputBorder()),
                      items: AppConstants.stealthOptions.entries
                          .map((e) => DropdownMenuItem(value: e.key, child: Text(e.value)))
                          .toList(),
                      onChanged: (v) {
                        if (v != null) {
                          setState(() => _stealthMode = v);
                          StealthService.setStealthMode(v);
                        }
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Rehab Parameters
            const Text('Rehab Parameters', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      children: [
                        const Expanded(child: Text('Addiction Level')),
                        IconButton(icon: const Icon(Icons.remove), onPressed: () {
                          if (_addictionLevel > 1) setState(() => _addictionLevel--);
                        }),
                        Text('$_addictionLevel', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                        IconButton(icon: const Icon(Icons.add), onPressed: () {
                          if (_addictionLevel < 10) setState(() => _addictionLevel++);
                        }),
                      ],
                    ),
                    Row(
                      children: [
                        const Expanded(child: Text('Strictness')),
                        IconButton(icon: const Icon(Icons.remove), onPressed: () {
                          if (_strictness > 1) setState(() => _strictness--);
                        }),
                        Text('$_strictness', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                        IconButton(icon: const Icon(Icons.add), onPressed: () {
                          if (_strictness < 5) setState(() => _strictness++);
                        }),
                      ],
                    ),
                    const Divider(),
                    Text('Rehab duration: $_rehabDays days',
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Interruption Preferences
            const Text('Interruptions', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: DropdownButtonFormField<int>(
                  value: _cooldownMin,
                  decoration: const InputDecoration(labelText: 'Cooldown after unlock', border: OutlineInputBorder()),
                  items: [5, 10, 15, 20].map((v) => DropdownMenuItem(value: v, child: Text('$v minutes'))).toList(),
                  onChanged: (v) => setState(() => _cooldownMin = v ?? 10),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Profile
            const Text('Profile', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.person),
                      title: Text(user?.name ?? 'User'),
                      subtitle: Text('Age: ${user?.age ?? '-'}'),
                    ),
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.email),
                      title: Text(user?.email ?? '-'),
                      subtitle: const Text('Google account (read only)'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Language
            DropdownButtonFormField<String>(
              value: _language,
              decoration: const InputDecoration(labelText: 'Language', border: OutlineInputBorder()),
              items: ['English', 'Hindi', 'Tamil', 'Telugu']
                  .map((l) => DropdownMenuItem(value: l, child: Text(l)))
                  .toList(),
              onChanged: (v) => setState(() => _language = v ?? 'English'),
            ),
            const SizedBox(height: 16),

            // Notification toggles
            const Text('Notifications', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            SwitchListTile(
              title: const Text('Daily Summary'),
              value: _dailySummary,
              onChanged: (v) => setState(() => _dailySummary = v),
            ),
            SwitchListTile(
              title: const Text('Milestone Alerts'),
              value: _milestoneAlerts,
              onChanged: (v) => setState(() => _milestoneAlerts = v),
            ),
            SwitchListTile(
              title: const Text('Rehab Reminders'),
              value: _rehabReminders,
              onChanged: (v) => setState(() => _rehabReminders = v),
            ),
            const SizedBox(height: 16),

            // About
            const ListTile(
              leading: Icon(Icons.info_outline),
              title: Text('About'),
              subtitle: Text('Betaal AI v1.0.0'),
            ),
            const Divider(),

            // Sign Out
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  auth.signOut();
                  Navigator.pushReplacementNamed(context, '/signin');
                },
                icon: const Icon(Icons.logout),
                label: const Text('Sign Out'),
                style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
