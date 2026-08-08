class DirectorModel {
  final String id;
  final String name;
  final String phone;
  final String email;
  final DateTime activeSince;

  DirectorModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.email,
    required this.activeSince,
  });

  factory DirectorModel.fromMap(String id, Map<String, dynamic> map) {
    return DirectorModel(
      id: id,
      name: map['name'] ?? '',
      phone: map['phone'] ?? '',
      email: map['email'] ?? '',
      activeSince: DateTime.parse(map['activeSince']),
    );
  }

  Map<String, dynamic> toMap() => {
        'name': name,
        'phone': phone,
        'email': email,
        'activeSince': activeSince.toIso8601String(),
      };
}
