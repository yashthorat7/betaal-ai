class UserModel {
  final String uid;
  final String name;
  final int age;
  final String email;
  final String? avatarUrl;
  final int addictionLevel;
  final int strictness;
  final String createdAt;
  final String stealthIcon;
  final String stealthName;

  UserModel({
    required this.uid,
    required this.name,
    required this.age,
    required this.email,
    this.avatarUrl,
    required this.addictionLevel,
    required this.strictness,
    required this.createdAt,
    this.stealthIcon = 'default',
    this.stealthName = 'Betaal AI',
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      uid: json['uid'] ?? '',
      name: json['name'] ?? '',
      age: json['age'] ?? 0,
      email: json['email'] ?? '',
      avatarUrl: json['avatar_url'],
      addictionLevel: json['addiction_level'] ?? 5,
      strictness: json['strictness'] ?? 5,
      createdAt: json['created_at'] ?? '',
      stealthIcon: json['stealth_icon'] ?? 'default',
      stealthName: json['stealth_name'] ?? 'Betaal AI',
    );
  }

  Map<String, dynamic> toJson() => {
    'uid': uid,
    'name': name,
    'age': age,
    'email': email,
    'avatar_url': avatarUrl,
    'addiction_level': addictionLevel,
    'strictness': strictness,
    'created_at': createdAt,
    'stealth_icon': stealthIcon,
    'stealth_name': stealthName,
  };

  UserModel copyWith({
    String? name,
    int? age,
    int? addictionLevel,
    int? strictness,
    String? stealthIcon,
    String? stealthName,
  }) {
    return UserModel(
      uid: uid,
      name: name ?? this.name,
      age: age ?? this.age,
      email: email,
      avatarUrl: avatarUrl,
      addictionLevel: addictionLevel ?? this.addictionLevel,
      strictness: strictness ?? this.strictness,
      createdAt: createdAt,
      stealthIcon: stealthIcon ?? this.stealthIcon,
      stealthName: stealthName ?? this.stealthName,
    );
  }

  /// Compute rehab duration: clamp(addiction_level * 3 * (6 - strictness), 7, 90)
  int get rehabDays {
    final days = addictionLevel * 3 * (6 - strictness);
    return days.clamp(7, 90);
  }
}
