import 'package:flutter/material.dart';
import '../models/manager_request_model.dart';
import '../services/dashboard_service.dart';
import '../theme/app_theme.dart';
import '../widgets/stat_card.dart';
import 'manager_approvals_screen.dart';
import 'manager_list_screen.dart';
import 'director_profile_screen.dart';

class DirectorDashboardScreen extends StatefulWidget {
  const DirectorDashboardScreen({super.key});

  @override
  State<DirectorDashboardScreen> createState() => _DirectorDashboardScreenState();
}

class _DirectorDashboardScreenState extends State<DirectorDashboardScreen> {
  int _tabIndex = 0;

  final _screens = const [
    _DashboardHome(),
    ManagerApprovalsScreen(),
    ManagerListScreen(),
    DirectorProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _tabIndex, children: _screens),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tabIndex,
        onDestinationSelected: (i) => setState(() => _tabIndex = i),
        backgroundColor: Colors.white,
        indicatorColor: AppColors.pine.withOpacity(0.12),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.pending_actions_outlined), selectedIcon: Icon(Icons.pending_actions), label: 'Approvals'),
          NavigationDestination(icon: Icon(Icons.groups_outlined), selectedIcon: Icon(Icons.groups), label: 'Managers'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

class _DashboardHome extends StatefulWidget {
  const _DashboardHome();

  @override
  State<_DashboardHome> createState() => _DashboardHomeState();
}

class _DashboardHomeState extends State<_DashboardHome> {
  final _service = DashboardService();
  DashboardStats? _stats;

  @override
  void initState() {
    super.initState();
    _service.getStats().then((s) {
      if (mounted) setState(() => _stats = s);
    });
  }

  @override
  Widget build(BuildContext context) {
    final s = _stats;
    return Scaffold(
      appBar: AppBar(title: const Text('Director Dashboard')),
      body: s == null
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () async {
                final fresh = await _service.getStats();
                setState(() => _stats = fresh);
              },
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  if (s.pendingManagerApprovals > 0)
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.coral.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.coral.withOpacity(0.3)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.notifications_active_outlined, color: AppColors.coral),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              '${s.pendingManagerApprovals} naye Manager registration approval ke liye pending hain',
                              style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w500),
                            ),
                          ),
                        ],
                      ),
                    ),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 1.3,
                    children: [
                      StatCard(label: 'Total Managers', value: '${s.totalManagers}', icon: Icons.groups_outlined),
                      StatCard(label: 'Total Admins', value: '${s.totalAdmins}', icon: Icons.admin_panel_settings_outlined),
                      StatCard(label: 'Total Partners', value: '${s.totalPartners}', icon: Icons.handshake_outlined),
                      StatCard(label: 'Bookings Today', value: '${s.activeBookingsToday}', icon: Icons.event_note_outlined),
                    ],
                  ),
                ],
              ),
            ),
    );
  }
}
