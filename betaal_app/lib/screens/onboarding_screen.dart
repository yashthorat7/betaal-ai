import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pageController = PageController();
  int _currentPage = 0;

  // Step 1
  final _nameController = TextEditingController(text: 'Arjun');
  int _age = 19;

  // Step 2
  int _addictionLevel = 8;

  // Step 3
  int _strictness = 3;

  // Step 4
  bool _usagePerm = false;
  bool _overlayPerm = false;
  bool _batteryPerm = false;
  bool _notifPerm = false;

  int get _rehabDays {
    final days = _addictionLevel * 3 * (6 - _strictness);
    return days.clamp(7, 90);
  }

  void _next() {
    if (_currentPage < 3) {
      _pageController.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
    } else {
      context.read<AuthProvider>().completeOnboarding(
        name: _nameController.text,
        age: _age,
        addictionLevel: _addictionLevel,
        strictness: _strictness,
      );
      Navigator.pushReplacementNamed(context, '/main');
    }
  }

  void _back() {
    if (_currentPage > 0) {
      _pageController.previousPage(duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Step ${_currentPage + 1} of 4'),
        centerTitle: true,
      ),
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        onPageChanged: (i) => setState(() => _currentPage = i),
        children: [_step1(), _step2(), _step3(), _step4()],
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            if (_currentPage > 0)
              IconButton.outlined(
                onPressed: _back,
                icon: const Icon(Icons.arrow_back),
              ),
            const Spacer(),
            FilledButton.icon(
              onPressed: _next,
              icon: Icon(_currentPage == 3 ? Icons.check : Icons.arrow_forward),
              label: Text(_currentPage == 3 ? 'Start' : 'Next'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _step1() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Let's start with you", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 32),
          TextField(
            controller: _nameController,
            decoration: const InputDecoration(labelText: 'Your name', border: OutlineInputBorder()),
          ),
          const SizedBox(height: 24),
          const Text('Age', style: TextStyle(fontSize: 16)),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton.outlined(onPressed: () => setState(() { if (_age > 10) _age--; }), icon: const Icon(Icons.remove)),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Text('$_age', style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
              ),
              IconButton.outlined(onPressed: () => setState(() { if (_age < 99) _age++; }), icon: const Icon(Icons.add)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _step2() {
    final emojis = ['😊', '😐', '😰', '😫', '🤯', '💀', '☠️', '🔥', '⚡', '💣'];
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('What smartphone has done to you', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text('Rate your addiction level', style: TextStyle(color: Colors.grey)),
          const SizedBox(height: 32),
          Center(
            child: Text(emojis[_addictionLevel - 1], style: const TextStyle(fontSize: 64)),
          ),
          const SizedBox(height: 16),
          Center(
            child: Text('$_addictionLevel / 10', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 16),
          Slider(
            value: _addictionLevel.toDouble(),
            min: 1, max: 10, divisions: 9,
            label: '$_addictionLevel',
            onChanged: (v) => setState(() => _addictionLevel = v.round()),
          ),
        ],
      ),
    );
  }

  Widget _step3() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('How dedicated are you?', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text('Higher strictness = shorter but harder rehab', style: TextStyle(color: Colors.grey)),
          const SizedBox(height: 32),
          Center(
            child: Text('$_strictness / 5', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 16),
          Slider(
            value: _strictness.toDouble(),
            min: 1, max: 5, divisions: 4,
            label: '$_strictness',
            onChanged: (v) => setState(() => _strictness = v.round()),
          ),
          const SizedBox(height: 24),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                const Text('Your rehab plan', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Text('$_rehabDays days', style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(
                  'Addiction $_addictionLevel × Strictness $_strictness',
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _step4() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Setup permissions', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text('Betaal needs these to work properly', style: TextStyle(color: Colors.grey)),
          const SizedBox(height: 24),
          CheckboxListTile(
            title: const Text('Usage Access'),
            subtitle: const Text('Read which apps you use'),
            value: _usagePerm,
            onChanged: (v) => setState(() => _usagePerm = v ?? false),
          ),
          CheckboxListTile(
            title: const Text('Display Over Apps'),
            subtitle: const Text('Show interruption overlays'),
            value: _overlayPerm,
            onChanged: (v) => setState(() => _overlayPerm = v ?? false),
          ),
          CheckboxListTile(
            title: const Text('Battery Optimization'),
            subtitle: const Text('Keep tracking in background'),
            value: _batteryPerm,
            onChanged: (v) => setState(() => _batteryPerm = v ?? false),
          ),
          CheckboxListTile(
            title: const Text('Notifications'),
            subtitle: const Text('Rehab reminders & milestones'),
            value: _notifPerm,
            onChanged: (v) => setState(() => _notifPerm = v ?? false),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _pageController.dispose();
    super.dispose();
  }
}
