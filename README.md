<img width="180" height="162" alt="Screenshot 2026-07-14 151231" src="https://github.com/user-attachments/assets/1deb1c42-f08b-4b52-87b3-e4e023e6b1f3" /><p align="center">
 
</p>

# Busy Bucket 🧹

**We clean, you relax.**

Professional home-cleaning service platform, currently operating across **Mohali, Panchkula, Zirakpur (Chandigarh Tricity), Ludhiana, and Dehradun**, with localized booking pages for nearby areas like Rishikesh and Haridwar.

🌐 Live site: [busybucket.in](https://busybucket.in)

---

## 📖 About

Busy Bucket connects customers to on-demand home cleaning services through two channels:

- **Public website** — marketing, service info, city-wise booking pages, WhatsApp integration.
- **Internal role-based panel system** — a `Director → Manager → Admin → Partner` hierarchy that manages bookings, staff, and payments.

---

## 🏗️ System Architecture

| Surface | Technology | Status |
|---|---|---|
| Public website | WordPress + custom HTML/CSS (Elementor/Divi scoped CSS) | ✅ Live |
| Role-selector landing page | Static HTML (`hh.html`) | ✅ Live |
| Admin panel | HTML, stacked scroll layout | ✅ Live |
| Partner panel | HTML, mobile-first phone-frame layout | ✅ Live |
| Director panel | Flutter (Android / iOS / Web) | ✅ New — built |
| Manager panel | Flutter (planned, same pattern as Director) | 🔜 Planned |

Application logic in the Flutter app is kept **backend-agnostic** — service classes (`AuthService`, `ManagerApprovalService`, `DashboardService`, etc.) currently return mock/in-memory data, but are designed to be swapped for Firestore or a REST API without touching UI code.

---

## 👥 Role Hierarchy & Permissions

4 roles, strict top-to-bottom hierarchy — each level approves the one directly below it.

| Level | Role | Approved By | Approves | Core Responsibility |
|---|---|---|---|---|
| 1 | **Director** | Developer / Backend (manual) | New Managers | Overall business control, reports, final authority |
| 2 | **Manager** | Director (in-app) | New Admins | Area/city operations, Admin supervision |
| 3 | **Admin** | Manager / Director | New Partners | Booking assignment, partner management, payments |
| 4 | **Partner** | Admin | — | Field cleaning work, attendance, earnings |

### Permissions Matrix

| Action | Director | Manager | Admin | Partner |
|---|---|---|---|---|
| View all-city reports | ✔ | Own city only | Own city only | ✘ |
| Approve Manager registration | ✔ | ✘ | ✘ | ✘ |
| Approve Admin registration | ✔ | ✔ | ✘ | ✘ |
| Approve Partner registration | ✔ | ✔ | ✔ | ✘ |
| Assign bookings | View only | View only | ✔ | Receives only |
| Mark attendance | ✘ | ✘ | ✘ | ✔ |
| View own earnings | ✘ | ✘ | ✘ | ✔ |

---

## 📱 Panels

### Admin Panel
Single stacked-scroll HTML page with three sections: **Abhi ki Booking** (live status cards), **Booking Assign** (unassigned bookings, 30-sec accept/reject timer per partner), and **Partners** (Fixed / Under Training / Partner Requests tabs) with a dedicated Partner Onboarding screen.

### Partner Panel
Mobile-first, phone-frame layout. OTP login → Dashboard, Attendance, Payments, Profile, with a fixed bottom nav bar.

### Director Panel (Flutter)
Fully built Flutter app — OTP login, Dashboard with stat cards and a pending-approvals banner, a Manager Approvals tab (Accept/Reject), Managers list, and Profile.

```
lib/
  main.dart
  theme/app_theme.dart
  models/
    director_model.dart
    manager_request_model.dart
  services/
    auth_service.dart
    manager_approval_service.dart
    dashboard_service.dart
    pdf_export_service.dart
  screens/
    login_screen.dart
    otp_screen.dart
    director_dashboard_screen.dart
    manager_approvals_screen.dart
    manager_list_screen.dart
    director_profile_screen.dart
  widgets/
    stat_card.dart
    manager_request_card.dart
```

### Manager Panel (Planned)
Will follow the same pattern as the Director panel — Login/OTP, Dashboard, Admin Approvals, Admins List, Reports.

---

## 🔐 Registration & Approval Workflows

| Registration | Approved By | Notes |
|---|---|---|
| Director | Developer / Super-admin (manual, outside app) | Extra security gate — no one can self-provision the top-level role |
| Manager | Director (in-app) | Accept → account active, entry removed from queue instantly |
| Admin | Manager / Director | Planned |
| Partner | Admin | Already live in Admin Panel's "Partner Requests" tab |

**Flow:** submit → pending queue → Accept (account active, removed from queue) / Reject (removed, can re-register).

---

## 📊 Data Models

| Model | Fields |
|---|---|
| `DirectorModel` | id, name, phone, email, activeSince |
| `ManagerRequest` | id, name, phone, email, city, submittedAt, status |
| `DashboardStats` | totalManagers, totalAdmins, totalPartners, activeBookingsToday, pendingManagerApprovals |
| `DirectorRegistrationRequest` | id, name, phone, email, submittedAt, status |
| `PartnerModel` | id, name, phone, servicesAssigned, aadhaarDoc, panDoc, status |
| `BookingModel` | id, clientName, address, service, assignedPartnerId, status, timerSeconds |

---

## 🛠️ Tech Stack

- **Frontend (web):** WordPress, HTML/CSS/JS
- **Mobile app:** Flutter (Dart), `StatefulWidget` + `setState` (Provider/Riverpod planned as panels grow)
- **Packages:** `pdf`, `printing`, `cupertino_icons`
- **Backend:** Not finalized — Firebase/Firestore (fast, real-time, OTP auth) or custom REST API + PostgreSQL/MySQL are under consideration
- **Auth:** OTP-based phone login (Partner, Director; same pattern planned for Manager/Admin)

---

## 🚀 Getting Started (Flutter app)

```bash
flutter pub get
flutter run
```

## 🗺️ Roadmap

- [ ] Manager panel (Flutter, with Admin approvals)
- [ ] Migrate Admin panel from HTML to Flutter
- [ ] Migrate Partner panel from HTML to Flutter
- [ ] Connect real backend (Firestore/REST) — currently mock/in-memory
- [ ] Push notifications (new booking, new approval request, etc.)
- [ ] Reports & analytics dashboard

## 🔒 Security Notes

- OTP-based login reduces password risk — rate limiting on OTP is required.
- RBAC must be enforced server-side, not just hidden in the UI.
- Aadhaar/PAN documents require encrypted storage and access-logged downloads.

---

## 📄 License

Proprietary — © Busy Bucket / LIYOMIND PRIVATE LIMITED. All rights reserved.
