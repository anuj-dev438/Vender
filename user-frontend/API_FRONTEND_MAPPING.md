# COUNTRY DRIVE — COMPLETE API TO UI MAPPING

**Document Purpose**: Bidirectional mapping connecting every discovered User-facing backend endpoint to its corresponding React.js page, UI component, and frontend service in `Frontend/User/`.

---

## Complete API-to-UI Mapping Table

| Domain | Backend Route | Method | Auth Required | Frontend Service | UI Page | UI Component / Hook | Status |
|---|---|---|---|---|---|---|---|
| **Health** | `/api/v1/health` | GET | Public | `apiClient.get('/health')` | App Root | Diagnostics / Network Status | Integrated |
| **Auth** | `/api/v1/auth/register` | POST | Public | `authService.register` | Modal | `AuthModal.jsx` (Register Tab) | Integrated |
| **Auth** | `/api/v1/auth/login` | POST | Public | `authService.login` | Modal | `AuthModal.jsx` (Login Tab) | Integrated |
| **Auth** | `/api/v1/auth/google` | POST | Public | `authService.googleAuth` | Modal | `AuthModal.jsx` (Google Button) | Integrated |
| **Auth** | `/api/v1/auth/send-otp` | POST | Public | `authService.sendOtp` | Modal | `AuthModal.jsx` (OTP Flow) | Integrated |
| **Auth** | `/api/v1/auth/verify-otp` | POST | Public | `authService.verifyOtp` | Modal | `AuthModal.jsx` (OTP Flow) | Integrated |
| **Auth** | `/api/v1/auth/forgot-password` | POST | Public | `authService.forgotPassword` | Modal | `AuthModal.jsx` (Forgot Password) | Integrated |
| **Auth** | `/api/v1/auth/reset-password` | POST | Public | `authService.resetPassword` | Modal | `AuthModal.jsx` (Reset Password) | Integrated |
| **Auth** | `/api/v1/auth/me` | GET | CUSTOMER | `authService.getMe` | Global / Profile | `AuthContext.jsx`, `Navbar.jsx`, `ProfilePage.jsx` | Integrated |
| **Auth** | `/api/v1/auth/me` | PATCH | CUSTOMER | `authService.updateProfile` | Profile / Checkout | `ProfilePage.jsx`, `CheckoutPage.jsx` | Integrated |
| **Auth** | `/api/v1/auth/change-password` | POST | CUSTOMER | `authService.changePassword` | Profile | `ProfilePage.jsx` (Security Tab) | Integrated |
| **Auth** | `/api/v1/auth/logout` | POST | CUSTOMER | `authService.logout` | Global | `Navbar.jsx` (Dropdown) | Integrated |
| **Vehicles** | `/api/v1/vehicles` | GET | Public | `vehicleService.getVehicles` | Home / Browse | `HomePage.jsx`, `VehiclesPage.jsx`, `VehicleCatalog.jsx` | Integrated |
| **Vehicles** | `/api/v1/vehicles/nearby` | GET | Public | `vehicleService.getNearbyVehicles` | Browse / Search | `VehiclesPage.jsx`, `SearchModal.jsx` | Integrated |
| **Vehicles** | `/api/v1/vehicles/:id` | GET | Public | `vehicleService.getVehicleById` | Vehicle Details | `VehicleDetailPage.jsx`, `CheckoutPage.jsx` | Integrated |
| **Bookings** | `/api/v1/bookings` | POST | CUSTOMER | `bookingService.createBooking` | Checkout | `CheckoutPage.jsx`, `BookingModal.jsx` | Integrated |
| **Bookings** | `/api/v1/bookings` | GET | CUSTOMER | `bookingService.getBookings` | My Bookings | `MyBookingsPage.jsx` (Booking Cards) | Integrated |
| **Bookings** | `/api/v1/bookings/:id` | GET | CUSTOMER | `bookingService.getBookingById` | Booking Details | `BookingDetailPage.jsx`, `ActiveRentalPage.jsx` | Integrated |
| **Bookings** | `/api/v1/bookings/:id/cancellation-quote` | GET | CUSTOMER | `bookingService.getCancellationQuote` | Booking Details | `BookingDetailPage.jsx` (Cancel Modal) | Integrated |
| **Bookings** | `/api/v1/bookings/:id/cancel` | POST | CUSTOMER | `bookingService.cancelBooking` | Booking Details | `BookingDetailPage.jsx` (Cancel Modal) | Integrated |
| **Bookings** | `/api/v1/bookings/:id/request-extension` | POST | CUSTOMER | `bookingService.requestExtension` | Booking Details | `BookingDetailPage.jsx` (Extension Modal) | Integrated |
| **Bookings** | `/api/v1/bookings/extensions/verify-payment` | POST | CUSTOMER | `bookingService.verifyExtensionPayment` | Booking Details | `BookingDetailPage.jsx` (Extension Modal) | Integrated |
| **Bookings** | `/api/v1/bookings/extensions/:extensionId` | GET | CUSTOMER | `bookingService.getExtension` | Booking Details | `BookingDetailPage.jsx` (Extension Status) | Integrated |
| **Payments** | `/api/v1/payments/create-order` | POST | CUSTOMER | `paymentService.createOrder` | Checkout | `CheckoutPage.jsx` (Razorpay Pay Button) | Integrated |
| **Payments** | `/api/v1/payments/verify` | POST | CUSTOMER | `paymentService.verifyPayment` | Checkout | `CheckoutPage.jsx` (Payment Callback Handler) | Integrated |
| **Payments** | `/api/v1/payments/booking/:bookingId` | GET | CUSTOMER | `paymentService.getByBookingId` | Booking Details | `BookingDetailPage.jsx` (Transactions Tab) | Integrated |
| **Payments** | `/api/v1/payments/:id` | GET | CUSTOMER | `paymentService.getById` | Booking Details | `BookingDetailPage.jsx` (Receipt Modal) | Integrated |
| **Rentals** | `/api/v1/rentals/:bookingId` | GET | CUSTOMER | `rentalService.getDetails` | Active Rental | `ActiveRentalPage.jsx` (Session Timeline) | Integrated |
| **Rentals** | `/api/v1/rentals/:bookingId/pickup` | POST | CUSTOMER | `rentalService.submitPickupInspection` | Active Rental | `ActiveRentalPage.jsx` (Pickup Checklist) | Integrated |
| **Rentals** | `/api/v1/rentals/:bookingId/return` | POST | CUSTOMER | `rentalService.submitReturnInspection` | Active Rental | `ActiveRentalPage.jsx` (Return Checklist) | Integrated |
| **Rentals** | `/api/v1/rentals/:bookingId/gps/latest` | GET | CUSTOMER | `rentalService.getLatestGps` | Active Rental | `ActiveRentalPage.jsx` (Live Vehicle Tracker) | Integrated |
| **Rentals** | `/api/v1/rentals/:bookingId/gps/history` | GET | CUSTOMER | `rentalService.getGpsHistory` | Active Rental | `ActiveRentalPage.jsx` (Trip Route History) | Integrated |
| **Rentals** | `ws://.../rentals/:bookingId/track` | WS | CUSTOMER | `rentalService.connectLiveTracking` | Active Rental | `ActiveRentalPage.jsx` (Live Map & Speed) | Integrated |
| **KYC** | `/api/v1/kyc/status` | GET | CUSTOMER | `kycService.getStatus` | KYC / Profile | `KycPage.jsx`, `ProfilePage.jsx` | Integrated |
| **KYC** | `/api/v1/kyc/submit` | POST | CUSTOMER | `kycService.submitKyc` | KYC Verification | `KycPage.jsx` (Submit Button) | Integrated |
| **KYC** | `/api/v1/kyc/documents` | POST | CUSTOMER | `kycService.uploadDocument` | KYC Verification | `KycPage.jsx` (Upload Cards) | Integrated |
| **KYC** | `/api/v1/kyc/documents` | GET | CUSTOMER | `kycService.listDocuments` | KYC Verification | `KycPage.jsx` (Document List & Preview) | Integrated |
| **KYC** | `/api/v1/kyc/documents/:docId` | DELETE | CUSTOMER | `kycService.deleteDocument` | KYC Verification | `KycPage.jsx` (Remove Document) | Integrated |
| **KYC** | `/api/v1/kyc/details` | POST | CUSTOMER | `kycService.saveDetails` | KYC Verification | `KycPage.jsx`, `CheckoutPage.jsx` | Integrated |
| **KYC** | `/api/v1/kyc/details` | GET | CUSTOMER | `kycService.getDetails` | KYC Verification | `KycPage.jsx` (Form Pre-fill) | Integrated |
| **KYC** | `/api/v1/kyc/selfie` | POST | CUSTOMER | `kycService.uploadSelfie` | KYC Verification | `KycPage.jsx` (Camera / Selfie Upload) | Integrated |
| **KYC** | `/api/v1/kyc/selfie` | GET | CUSTOMER | `kycService.getSelfie` | KYC Verification | `KycPage.jsx` (Selfie Status Badge) | Integrated |
| **KYC** | `/api/v1/kyc/check-eligibility` | POST | CUSTOMER | `kycService.checkEligibility` | Checkout / Vehicle | `CheckoutPage.jsx`, `VehicleDetailPage.jsx` | Integrated |
| **Uploads** | `/api/v1/uploads/presigned-url` | POST | CUSTOMER | `uploadService.getPresignedUrl` | Global | `uploadService.uploadFile` | Integrated |
| **Uploads** | `/api/v1/uploads/view-url` | POST | CUSTOMER | `uploadService.getViewUrl` | Global | `uploadService.getViewUrl` | Integrated |
| **Reviews** | `/api/v1/rentals/:bookingId/reviews` | POST | CUSTOMER | `reviewService.submitReview` | Booking Details | `BookingDetailPage.jsx` (Review Modal) | Integrated |
| **Reviews** | `/api/v1/rentals/:bookingId/reviews` | GET | CUSTOMER | `reviewService.getBookingReview` | Booking Details | `BookingDetailPage.jsx` (My Review Card) | Integrated |
| **Reviews** | `/api/v1/vehicles/:vehicleId/reviews` | GET | Public | `reviewService.getVehicleReviews` | Vehicle Details | `VehicleDetailPage.jsx` (Verified Reviews) | Integrated |
| **Notifications** | `/api/v1/notifications` | GET | CUSTOMER | `notificationService.list` | Navigation Bar | `Navbar.jsx` (Notifications Flyout) | Integrated |
| **Notifications** | `/api/v1/notifications/unread-count` | GET | CUSTOMER | `notificationService.getUnreadCount` | Navigation Bar | `Navbar.jsx` (Unread Badge) | Integrated |
| **Notifications** | `/api/v1/notifications/:id/read` | PATCH | CUSTOMER | `notificationService.markAsRead` | Navigation Bar | `Navbar.jsx` (Item Click) | Integrated |
| **Notifications** | `/api/v1/notifications/read-all` | PATCH | CUSTOMER | `notificationService.markAllAsRead` | Navigation Bar | `Navbar.jsx` ("Mark All Read" Action) | Integrated |
| **Support** | `/api/v1/support/tickets` | POST | CUSTOMER | `supportService.createTicket` | Support / Help | `SupportPage.jsx` (New Ticket Form) | Integrated |
| **Support** | `/api/v1/support/tickets` | GET | CUSTOMER | `supportService.getMyTickets` | Support / Help | `SupportPage.jsx` (Tickets Tab) | Integrated |
| **Support** | `/api/v1/support/tickets/:id` | GET | CUSTOMER | `supportService.getTicketDetails` | Support / Help | `SupportPage.jsx` (Ticket Conversation) | Integrated |
| **Support** | `/api/v1/support/tickets/:id/messages` | POST | CUSTOMER | `supportService.addTicketMessage` | Support / Help | `SupportPage.jsx` (Reply Input) | Integrated |
| **Disputes** | `/api/v1/rentals/:bookingId/disputes` | POST | CUSTOMER | `supportService.raiseDispute` | Booking / Active Rental | `BookingDetailPage.jsx`, `ActiveRentalPage.jsx` | Integrated |
| **Disputes** | `/api/v1/disputes` | GET | CUSTOMER | `supportService.getMyDisputes` | Support / Help | `SupportPage.jsx` (Disputes Tab) | Integrated |
| **Disputes** | `/api/v1/disputes/:id` | GET | CUSTOMER | `supportService.getDisputeDetails` | Support / Help | `SupportPage.jsx` (Dispute Mediation View) | Integrated |
| **Disputes** | `/api/v1/disputes/:id/messages` | POST | CUSTOMER | `supportService.addDisputeMessage` | Support / Help | `SupportPage.jsx` (Evidence / Message Send) | Integrated |
| **Offers** | `/api/v1/offers` | GET | Public | `offerService.getActiveOffers` | Home / Checkout | `HomePage.jsx`, `CheckoutPage.jsx` | Integrated |
| **Coupons** | `/api/v1/coupons/validate` | POST | CUSTOMER | `offerService.validateCoupon` | Checkout | `CheckoutPage.jsx` (Apply Coupon Box) | Integrated |
| **Subscriptions**| `/api/v1/subscriptions/plans` | GET | Public | `subscriptionService.getActivePlans` | Subscriptions | `SubscriptionsPage.jsx` (Pricing Cards) | Integrated |
| **Subscriptions**| `/api/v1/subscriptions/plans/:id` | GET | Public | `subscriptionService.getPlanById` | Subscriptions | `SubscriptionsPage.jsx` (Plan Details) | Integrated |
| **Subscriptions**| `/api/v1/subscriptions/my-subscription` | GET | CUSTOMER | `subscriptionService.getMySubscription` | Subscriptions / Profile | `SubscriptionsPage.jsx`, `ProfilePage.jsx` | Integrated |
| **Subscriptions**| `/api/v1/subscriptions/create-order` | POST | CUSTOMER | `subscriptionService.createOrder` | Subscriptions | `SubscriptionsPage.jsx` (Subscribe Button) | Integrated |
| **Subscriptions**| `/api/v1/subscriptions/verify-payment` | POST | CUSTOMER | `subscriptionService.verifyPayment` | Subscriptions | `SubscriptionsPage.jsx` (Payment Handler) | Integrated |
| **Subscriptions**| `/api/v1/subscriptions/:id/cancel` | POST | CUSTOMER | `subscriptionService.cancelSubscription` | Subscriptions | `SubscriptionsPage.jsx` (Cancel Subscription) | Integrated |
| **Banners** | `/api/v1/banners` | GET | Public | `bannerService.getActiveBanners` | Home Page | `Hero.jsx`, `AppBanner.jsx` | Integrated |
| **Banners** | `/api/v1/banners/position/:position` | GET | Public | `bannerService.getBannersByPosition` | Browse / Offers | `VehiclesPage.jsx` | Integrated |

---

## Field-Level Bidirectional Mapping Highlights

### 1. Booking Checkout Flow (`CheckoutPage.jsx` → `POST /api/v1/bookings`)
- `vehicleId`: Selected vehicle UUID.
- `startAt`: ISO datetime selected in pickup datetime picker.
- `endAt`: ISO datetime selected in return datetime picker.
- `planType`: `PAY_AS_YOU_GO` or `SUBSCRIPTION`.
- `couponCode`: Validated discount code from coupon input.
- **Backend Response Parsed**:
  - `id`: Booking UUID.
  - `pricing`: `{ baseAmount, platformFee, taxAmount, totalAmount, securityDeposit }`.
  - `status`: `PAYMENT_PENDING`.

### 2. Live Payment Verification (`CheckoutPage.jsx` → `POST /api/v1/payments/verify`)
- `bookingId`: UUID from booking creation step.
- `razorpayOrderId`: ID generated by `POST /payments/create-order`.
- `razorpayPaymentId`: ID returned by Razorpay checkout SDK.
- `razorpaySignature`: Signature returned by Razorpay checkout SDK.
- **Backend Response**:
  - `status`: `CONFIRMED`.
  - Immediate redirect to `/booking-success/:id`.

### 3. Inspection Checklist Flow (`ActiveRentalPage.jsx` → `/api/v1/rentals/:bookingId/pickup` & `return`)
- Pickup:
  - `odometerReading`: Number entered by customer/agent.
  - `fuelLevel`: Number (0-100) from fuel gauge slider.
  - `photos`: 6 mandatory photos (`FRONT`, `REAR`, `LEFT`, `RIGHT`, `INTERIOR_DASHBOARD`, `INTERIOR_SEATS`) uploaded to S3 via `uploadService`.
- Return:
  - `odometerReading`, `fuelLevel`.
  - `damages`: Array of `{ damageType, severity, description, estimatedCost, photoUrls }`.
