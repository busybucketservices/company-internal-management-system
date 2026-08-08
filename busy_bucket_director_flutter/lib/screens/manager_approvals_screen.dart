import 'package:flutter/material.dart';
import '../models/manager_request_model.dart';
import '../services/manager_approval_service.dart';
import '../widgets/manager_request_card.dart';

class ManagerApprovalsScreen extends StatefulWidget {
  const ManagerApprovalsScreen({super.key});

  @override
  State<ManagerApprovalsScreen> createState() => _ManagerApprovalsScreenState();
}

class _ManagerApprovalsScreenState extends State<ManagerApprovalsScreen> {
  final _service = InMemoryManagerApprovalService();
  List<ManagerRequest> _requests = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final data = await _service.getPendingRequests();
    if (!mounted) return;
    setState(() {
      _requests = data;
      _loading = false;
    });
  }

  Future<void> _accept(String id) async {
    await _service.accept(id);
    _load();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Manager accept ho gaya — account active')),
      );
    }
  }

  Future<void> _reject(String id) async {
    await _service.reject(id);
    _load();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Request reject kar di gayi')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Manager Approvals')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _requests.isEmpty
              ? const Center(child: Text('Koi pending request nahi hai'))
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _requests.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, i) {
                      final r = _requests[i];
                      return ManagerRequestCard(
                        request: r,
                        onAccept: () => _accept(r.id),
                        onReject: () => _reject(r.id),
                      );
                    },
                  ),
                ),
    );
  }
}
