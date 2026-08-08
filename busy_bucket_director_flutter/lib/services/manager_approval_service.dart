import '../models/manager_request_model.dart';

/// Handles the Manager-registration approval flow that the Director
/// reviews from the app. (Director's OWN registration is a separate,
/// developer-side approval — see busy_bucket_docs.dart /
/// RegistrationApprovalService.)
abstract class ManagerApprovalService {
  Future<List<ManagerRequest>> getPendingRequests();
  Future<void> accept(String requestId);
  Future<void> reject(String requestId);
}

/// In-memory reference implementation with a few seeded demo requests.
/// Replace with Firestore/REST calls in production.
class InMemoryManagerApprovalService implements ManagerApprovalService {
  final Map<String, ManagerRequest> _store = {
    'm1': ManagerRequest(
      id: 'm1',
      name: 'Ramandeep Singh',
      phone: '+91 98765 43210',
      email: 'raman@example.com',
      city: 'Zirakpur',
      submittedAt: DateTime.now().subtract(const Duration(hours: 5)),
    ),
    'm2': ManagerRequest(
      id: 'm2',
      name: 'Neha Sharma',
      phone: '+91 91234 56780',
      email: 'neha@example.com',
      city: 'Ludhiana',
      submittedAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
  };

  @override
  Future<List<ManagerRequest>> getPendingRequests() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _store.values.where((r) => r.status == ApprovalStatus.pending).toList()
      ..sort((a, b) => b.submittedAt.compareTo(a.submittedAt));
  }

  @override
  Future<void> accept(String requestId) async {
    final req = _store[requestId];
    if (req == null) return;
    // TODO: create the actual Manager account + role assignment here
    _store.remove(requestId); // removed from pending queue
  }

  @override
  Future<void> reject(String requestId) async {
    _store.remove(requestId); // removed from pending queue
  }
}
