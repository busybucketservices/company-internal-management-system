enum ApprovalStatus { pending, accepted, rejected }

class ManagerRequest {
  final String id;
  final String name;
  final String phone;
  final String email;
  final String city; // e.g. Mohali, Zirakpur, Ludhiana, Dehradun
  final DateTime submittedAt;
  ApprovalStatus status;

  ManagerRequest({
    required this.id,
    required this.name,
    required this.phone,
    required this.email,
    required this.city,
    required this.submittedAt,
    this.status = ApprovalStatus.pending,
  });

  factory ManagerRequest.fromMap(String id, Map<String, dynamic> map) {
    return ManagerRequest(
      id: id,
      name: map['name'] ?? '',
      phone: map['phone'] ?? '',
      email: map['email'] ?? '',
      city: map['city'] ?? '',
      submittedAt: DateTime.parse(map['submittedAt']),
      status: ApprovalStatus.values.byName(map['status'] ?? 'pending'),
    );
  }

  Map<String, dynamic> toMap() => {
        'name': name,
        'phone': phone,
        'email': email,
        'city': city,
        'submittedAt': submittedAt.toIso8601String(),
        'status': status.name,
      };
}

/// Simple summary model used on the Director dashboard.
class DashboardStats {
  final int totalManagers;
  final int totalAdmins;
  final int totalPartners;
  final int activeBookingsToday;
  final int pendingManagerApprovals;

  DashboardStats({
    required this.totalManagers,
    required this.totalAdmins,
    required this.totalPartners,
    required this.activeBookingsToday,
    required this.pendingManagerApprovals,
  });
}
