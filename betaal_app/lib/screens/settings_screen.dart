import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../dummy/dummy_data.dart';
import '../models/badge_model.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  static const _charcoal = Color(0xFF101018);
  static const _bgColor = Color(0xFFF2F2F2);
  static const _textMuted = Color(0xFF6B7280);
  static const _borderColor = Color(0xFFE5E7EB);
  static const _cardColor = Color(0xFFF9FAFB);
  static const _teal = Color(0xFF2DD4BF);

  bool _dailySummary = true;
  bool _milestoneAlerts = true;
  bool _rehabReminders = false;

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;
    final badges = DummyData.getBadges();

    return Scaffold(
      backgroundColor: _bgColor,
      body: SafeArea(
        child: Column(
          children: [
            // --- TOP BAR ---
            const Padding(
              padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Row(
                children: [
                  SizedBox(width: 40),
                  Expanded(
                    child: Text(
                      'SETTINGS',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1.2,
                        color: _charcoal,
                      ),
                    ),
                  ),
                  SizedBox(width: 40),
                ],
              ),
            ),

            // --- SCROLLABLE CONTENT ---
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  const SizedBox(height: 16),

                  // --- PROFILE AVATAR + INFO (centered) ---
                  Center(
                    child: Column(
                      children: [
                        // Avatar
                        Container(
                          width: 88,
                          height: 88,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white,
                            border: Border.all(color: _teal.withOpacity(0.3), width: 3),
                            boxShadow: [
                              BoxShadow(
                                color: _teal.withOpacity(0.12),
                                blurRadius: 16,
                                offset: const Offset(0, 4),
                              ),
                              BoxShadow(
                                color: Colors.black.withOpacity(0.05),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: const CircleAvatar(
                            radius: 40,
                            backgroundColor: Color(0xFFE8E8E8),
                            child: Icon(Icons.person, color: Color(0xFF888888), size: 40),
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Name
                        Text(
                          user?.name ?? 'User',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w700,
                            color: _charcoal,
                            letterSpacing: -0.3,
                          ),
                        ),
                        const SizedBox(height: 6),
                        // Email
                        Text(
                          user?.email ?? '-',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w400,
                            color: _textMuted,
                          ),
                        ),
                        const SizedBox(height: 4),
                        // Age
                        Container(
                          margin: const EdgeInsets.only(top: 4),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: _teal.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: Text(
                            'Age ${user?.age ?? '-'}',
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: _teal,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // --- ACHIEVEMENTS HEADER ---
                  Row(
                    children: [
                      const Text(
                        'Achievements',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: _charcoal,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        '${badges.where((b) => b.earned).length}/${badges.length} earned',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: _textMuted,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // --- ACHIEVEMENTS HORIZONTAL SCROLL ---
                  SizedBox(
                    height: 156,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: badges.length,
                      itemBuilder: (_, i) => _BadgeCard(badge: badges[i]),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // --- NOTIFICATIONS ---
                  _buildCard(
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFF3A86FF).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.notifications_outlined, color: Color(0xFF3A86FF), size: 20),
                            ),
                            const SizedBox(width: 12),
                            const Text(
                              'NOTIFICATIONS',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                letterSpacing: 1.5,
                                color: _textMuted,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _buildToggleRow('Daily Summary', _dailySummary, (v) => setState(() => _dailySummary = v)),
                        _buildToggleRow('Milestone Alerts', _milestoneAlerts, (v) => setState(() => _milestoneAlerts = v)),
                        _buildToggleRow('Rehab Reminders', _rehabReminders, (v) => setState(() => _rehabReminders = v)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // --- ABOUT US ---
                  _buildCard(
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: const Color(0xFF8B5CF6).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.info_outline, color: Color(0xFF8B5CF6), size: 20),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'About Us',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: _charcoal,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                'Learn more about Betaal AI',
                                style: TextStyle(fontSize: 12, color: _textMuted),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.chevron_right, color: _textMuted, size: 20),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // --- APP VERSION ---
                  _buildCard(
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(Icons.phone_android, color: Colors.grey.shade500, size: 20),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'App Version',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: _charcoal,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                'v1.0.0 (Build 1)',
                                style: TextStyle(fontSize: 12, color: _textMuted),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: _teal.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            'Latest',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: _teal,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // --- SIGN OUT ---
                  GestureDetector(
                    onTap: () {
                      auth.signOut();
                      Navigator.pushReplacementNamed(context, '/signin');
                    },
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE17070).withOpacity(0.3)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.02),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.logout, color: Color(0xFFE17070), size: 20),
                          SizedBox(width: 8),
                          Text(
                            'Sign Out',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFFE17070),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCard({required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: _cardColor,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: _borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: child,
    );
  }

  Widget _buildToggleRow(String label, bool value, ValueChanged<bool> onChanged) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: _charcoal,
              ),
            ),
          ),
          SizedBox(
            height: 28,
            child: Switch(
              value: value,
              onChanged: onChanged,
              activeColor: _teal,
              activeTrackColor: _teal.withOpacity(0.3),
              inactiveThumbColor: Colors.grey.shade300,
              inactiveTrackColor: Colors.grey.shade200,
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
          ),
        ],
      ),
    );
  }
}

// --- Badge Card for horizontal scroll ---
class _BadgeCard extends StatelessWidget {
  final AchievementBadge badge;

  const _BadgeCard({required this.badge});

  static const _teal = Color(0xFF2DD4BF);
  static const _charcoal = Color(0xFF101018);
  static const _borderColor = Color(0xFFE5E7EB);

  @override
  Widget build(BuildContext context) {
    final earned = badge.earned;
    final accentColor = earned ? _teal : Colors.grey.shade400;

    return Container(
      width: 120,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: earned ? Colors.white : const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: earned ? _teal.withOpacity(0.25) : _borderColor,
        ),
        boxShadow: [
          if (earned)
            BoxShadow(
              color: _teal.withOpacity(0.08),
              blurRadius: 10,
              offset: const Offset(0, 3),
            )
          else
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 4,
              offset: const Offset(0, 1),
            ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Icon container
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: accentColor.withOpacity(0.12),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(badge.icon, size: 22, color: accentColor),
          ),
          const SizedBox(height: 10),
          // Badge name
          Text(
            badge.name,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: earned ? _charcoal : Colors.grey.shade500,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          // Progress bar or earned indicator
          if (earned)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: _teal.withOpacity(0.1),
                borderRadius: BorderRadius.circular(999),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.check_circle, size: 12, color: _teal),
                  SizedBox(width: 3),
                  Text(
                    'Earned',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: _teal,
                    ),
                  ),
                ],
              ),
            )
          else
            Column(
              children: [
                // Progress bar
                Container(
                  height: 4,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(999),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: FractionallySizedBox(
                        widthFactor: (badge.progress / 100).clamp(0.05, 1.0),
                        child: Container(
                          decoration: BoxDecoration(
                            color: _teal.withOpacity(0.45),
                            borderRadius: BorderRadius.circular(999),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${badge.progress}%',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade500,
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }
}
