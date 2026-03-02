import 'package:flutter/material.dart';
import '../models/chat_message.dart';
import '../dummy/dummy_data.dart';

class ChatProvider extends ChangeNotifier {
  final List<ChatMessage> _messages = [];

  List<ChatMessage> get messages => _messages;

  void loadInitialMessages() {
    if (_messages.isEmpty) {
      _messages.addAll(DummyData.getInitialChat());
      notifyListeners();
    }
  }

  Future<void> sendMessage(String text) async {
    _messages.add(ChatMessage(message: text, role: 'user'));
    notifyListeners();

    // Simulate AI response delay
    await Future.delayed(const Duration(seconds: 1));
    _messages.add(ChatMessage(
      message: DummyData.getAIResponse(text),
      role: 'assistant',
    ));
    notifyListeners();
  }
}
