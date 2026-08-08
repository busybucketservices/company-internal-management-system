import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class ManagerListScreen extends StatelessWidget {
  const ManagerListScreen({super.key});

  // TODO: replace with real data from backend
  static const _managers = [
    {'name': 'Simran Kaur', 'city': 'Mohali', 'phone': '+91 90000 11111'},
    {'name': 'Arjun Verma', 'city': 'Panchkula', 'phone': '+91 90000 22222'},
    {'name': 'Karan Mehta', 'city': 'Dehradun', 'phone': '+91 90000 33333'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Active Managers')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _managers.length,
        separatorBuilder: (_, __) => const SizedBox(height: 10),
        itemBuilder: (context, i) {
          final m = _managers[i];
          return Card(
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: AppColors.pine.withOpacity(0.12),
                child: Text(m['name']![0], style: const TextStyle(color: AppColors.pineDark)),
              ),
              title: Text(m['name']!),
              subtitle: Text('${m['city']} • ${m['phone']}'),
              trailing: const Icon(Icons.chevron_right),
            ),
          );
        },
      ),
    );
  }
}
