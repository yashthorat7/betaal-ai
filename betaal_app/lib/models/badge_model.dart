import 'package:flutter/material.dart';

class AchievementBadge {
  final String id;
  final String name;
  final String description;
  final IconData icon;
  final bool earned;
  final int progress; // 0-100

  AchievementBadge({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    this.earned = false,
    this.progress = 0,
  });
}
