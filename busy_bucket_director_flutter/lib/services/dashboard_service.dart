import '../models/manager_request_model.dart';

class DashboardService {
  /// Replace with real aggregation queries against your backend.
  Future<DashboardStats> getStats() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return DashboardStats(
      totalManagers: 4,
      totalAdmins: 9,
      totalPartners: 62,
      activeBookingsToday: 27,
      pendingManagerApprovals: 2,
    );
  }
}
