class ChatMessage {
  final String message;
  final String role; // "user" or "assistant"
  final DateTime timestamp;

  ChatMessage({
    required this.message,
    required this.role,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();

  bool get isUser => role == 'user';
}
