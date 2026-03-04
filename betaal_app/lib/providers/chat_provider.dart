import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../models/chat_message.dart';
import '../dummy/dummy_data.dart';

class ChatProvider extends ChangeNotifier {
  final List<ChatMessage> _messages = [];
  bool _isTyping = false;
  // Backend URL — your Mac's local IP for real device testing
  static const _backendUrl = 'http://10.58.25.239:8000';

  List<ChatMessage> get messages => _messages;
  bool get isTyping => _isTyping;

  void loadInitialMessages({String userName = 'User'}) {
    if (_messages.isEmpty) {
      final name = userName.isNotEmpty ? userName : 'User';
      _messages.add(ChatMessage(
        message: "Hi $name! I'm Betaal, your digital rehab assistant. How can I help you today?",
        role: 'assistant',
        timestamp: DateTime.now().subtract(const Duration(minutes: 1)),
      ));
      notifyListeners();
    }
  }

  Future<void> sendMessage(String text, {String uid = 'user1', String sessionId = 'default', String userName = 'User'}) async {
    _messages.add(ChatMessage(message: text, role: 'user'));
    _isTyping = true;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/chat'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'uid': uid,
          'message': text,
          'session_id': sessionId,
          'user_name': userName,
        }),
      ).timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _messages.add(ChatMessage(
          message: data['response'] ?? 'Sorry, I could not process that.',
          role: 'assistant',
        ));
      } else {
        _messages.add(ChatMessage(
          message: DummyData.getAIResponse(text),
          role: 'assistant',
        ));
      }
    } catch (e) {
      debugPrint('Chat API error: $e');
      _messages.add(ChatMessage(
        message: DummyData.getAIResponse(text),
        role: 'assistant',
      ));
    }
    _isTyping = false;
    notifyListeners();
  }
}
