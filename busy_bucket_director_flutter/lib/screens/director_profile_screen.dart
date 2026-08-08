import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'login_screen.dart';

class DirectorProfileScreen extends StatelessWidget {
  const DirectorProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const CircleAvatar(
              radius: 36,
              backgroundColor: AppColors.pine,
              child: Icon(Icons.person, color: Colors.white, size: 36),
            ),
            const SizedBox(height: 14),
            // TODO: bind to logged-in DirectorModel
            const Text('Director Name', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const Text('+91 98765 43210', style: TextStyle(color: Colors.black54)),
            const SizedBox(height: 24),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.settings_outlined),
              title: const Text('Account Settings'),
              onTap: () {},
            ),
            ListTile(
              leading: const Icon(Icons.bar_chart_outlined),
              title: const Text('Reports'),
              onTap: () {},
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout, color: Colors.redAccent),
              title: const Text('Logout', style: TextStyle(color: Colors.redAccent)),
              onTap: () {
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (route) => false,
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
