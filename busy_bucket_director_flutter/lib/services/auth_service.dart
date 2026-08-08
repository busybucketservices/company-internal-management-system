/// Backend-agnostic auth service. Swap the two methods below with your
/// real SMS/OTP provider (Firebase Auth phone sign-in, MSG91, etc).
class AuthService {
  /// Sends an OTP to [phone]. Returns a verificationId you pass to verifyOtp.
  Future<String> sendOtp(String phone) async {
    await Future.delayed(const Duration(seconds: 1));
    // TODO: replace with real SMS/OTP provider call
    return 'mock-verification-id';
  }

  /// Verifies the OTP entered by the user.
  Future<bool> verifyOtp({
    required String verificationId,
    required String otp,
  }) async {
    await Future.delayed(const Duration(seconds: 1));
    // TODO: replace with real verification call
    return otp.length == 6; // demo rule only
  }
}
