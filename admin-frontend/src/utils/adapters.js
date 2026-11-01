/**
 * Data Adapters: Maps backend Prisma models to Frontend UI view models.
 * Preserves 100% of all backend fields (...raw) while providing resilient, normalized accessors
 * so that no backend field or option is ever lost or hidden.
 */

export function adaptVehicle(v) {
  if (!v) return null;
  const primaryMedia = v.media?.find((m) => m.isPrimary) || v.media?.[0];
  const primaryLocation = v.locations?.find((l) => l.isActive) || v.locations?.[0];

  return {
    ...v, // Preserve all raw backend fields (chassisNumber, engineNumber, fastagId, rcExpiryAt, etc.)
    id: v.id,
    registrationNumber: v.registrationNumber,
    registrationNo: v.registrationNumber,
    name: `${v.make || ''} ${v.model || ''} ${v.variant || ''}`.trim() || 'Vehicle',
    make: v.make,
    model: v.model,
    variant: v.variant || '',
    category: v.category,
    fuelType: v.fuelType,
    transmission: v.transmission || 'AUTOMATIC',
    seatingCapacity: v.seatingCapacity ? Number(v.seatingCapacity) : 5,
    color: v.color || 'Standard',
    status: v.status || 'AVAILABLE',
    verificationStatus: v.verificationStatus || 'VERIFIED',
    pricePerHour: Number(v.hourlyRate || 0),
    hourlyRate: Number(v.hourlyRate || 0),
    pricePerDay: Number(v.dailyRate || Number(v.hourlyRate || 0) * 8),
    dailyRate: Number(v.dailyRate || Number(v.hourlyRate || 0) * 8),
    securityDeposit: Number(v.securityDeposit || 0),
    includedKm: Number(v.includedKm || 150),
    extraKmRate: Number(v.extraKmRate || 10),
    extraHourRate: v.extraHourRate ? Number(v.extraHourRate) : null,
    odometerReading: Number(v.odometerReading || 0),
    fuelLevel: v.fuelLevel !== null && v.fuelLevel !== undefined ? Number(v.fuelLevel) : null,
    batteryLevel: v.batteryLevel !== null && v.batteryLevel !== undefined ? Number(v.batteryLevel) : null,
    engineCapacity: v.engineCapacity ? Number(v.engineCapacity) : null,
    batteryCapacity: v.batteryCapacity ? Number(v.batteryCapacity) : null,
    manufacturingYear: v.manufacturingYear,
    registrationYear: v.registrationYear,
    chassisNumber: v.chassisNumber || '',
    engineNumber: v.engineNumber || '',
    fastagId: v.fastagId || '',
    rcExpiryAt: v.rcExpiryAt,
    insuranceExpiryAt: v.insuranceExpiryAt,
    pucExpiryAt: v.pucExpiryAt,
    fitnessExpiryAt: v.fitnessExpiryAt,
    description: v.description || '',
    city: v.city,
    state: v.state,
    country: v.country || 'IN',
    latitude: v.latitude ? Number(v.latitude) : null,
    longitude: v.longitude ? Number(v.longitude) : null,
    location: primaryLocation ? `${primaryLocation.area || ''}, ${primaryLocation.city || ''}` : (v.city || 'Delhi NCR'),
    locations: v.locations || [],
    documents: v.documents || [],
    media: v.media || [],
    verifications: v.verifications || [],
    maintenance: v.maintenance || [],
    damageReports: v.damageReports || [],
    image: primaryMedia?.fileUrl || primaryMedia?.thumbnailUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    ownerId: v.ownerId,
    ownerName: v.owner?.name || 'Fleet Host',
    ownerPhone: v.owner?.phone || '',
    ownerEmail: v.owner?.email || '',
    ownerType: v.owner?.ownerProfile?.ownerType || 'INDIVIDUAL',
    businessName: v.owner?.ownerProfile?.businessName || '',
    trips: v._count?.bookings ?? 12,
    rating: 4.8,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  };
}

export function adaptBooking(b) {
  if (!b) return null;
  return {
    ...b, // Preserve all raw backend relations & fields
    id: b.id,
    bookingNumber: b.bookingNumber || b.id?.slice(0, 8),
    status: b.status,
    planType: b.planType || 'PAY_AS_YOU_GO',
    startDate: b.startAt,
    endDate: b.endAt,
    startAt: b.startAt,
    endAt: b.endAt,
    totalAmount: Number(b.totalAmount || 0),
    subtotal: Number(b.subtotal || 0),
    discountAmount: Number(b.discountAmount || 0),
    taxAmount: Number(b.taxAmount || 0),
    platformFee: Number(b.platformFee || 0),
    securityDeposit: Number(b.securityDepositAmount || 0),
    securityDepositAmount: Number(b.securityDepositAmount || 0),
    paymentStatus: b.paymentStatus || 'INITIATED',
    currency: b.currency || 'INR',
    verifiedDlNumber: b.verifiedDlNumber,
    verifiedDlCategory: b.verifiedDlCategory,
    isKycVerifiedAtBooking: b.isKycVerifiedAtBooking,
    confirmedAt: b.confirmedAt,
    cancelledAt: b.cancelledAt,
    cancelledBy: b.cancelledBy,
    cancellationReason: b.cancellationReason,
    completedAt: b.completedAt,
    customer: {
      id: b.customer?.id || b.customerId,
      name: b.customer?.name || 'Customer',
      phone: b.customer?.phone || '',
      email: b.customer?.email || '',
      avatarUrl: b.customer?.avatarUrl || null,
      isPhoneVerified: b.customer?.isPhoneVerified,
      dlNumber: b.customer?.customerProfile?.licenseNumber || b.verifiedDlNumber,
    },
    vehicle: {
      id: b.vehicle?.id || b.vehicleId,
      name: b.vehicle ? `${b.vehicle.make || ''} ${b.vehicle.model || ''} ${b.vehicle.variant || ''}`.trim() : 'Vehicle',
      make: b.vehicle?.make,
      model: b.vehicle?.model,
      variant: b.vehicle?.variant,
      registrationNumber: b.vehicle?.registrationNumber || '',
      category: b.vehicle?.category || 'CAR',
      fuelType: b.vehicle?.fuelType,
      city: b.vehicle?.city || '',
      image: b.vehicle?.media?.[0]?.fileUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    },
    owner: {
      id: b.owner?.id || b.ownerId,
      name: b.owner?.name || 'Owner',
      phone: b.owner?.phone || '',
      email: b.owner?.email || '',
      businessName: b.owner?.ownerProfile?.businessName || '',
    },
    pricingSnapshot: b.pricingSnapshot,
    priceItems: b.priceItems || [],
    rentalSession: b.rentalSession,
    extensions: b.extensions || [],
    cancellation: b.cancellation,
    settlement: b.settlement,
    payments: b.payments || [],
    securityDepositRecord: b.securityDeposit,
    commissionRecord: b.commissionRecord,
    ownerPayable: b.ownerPayable,
    statusHistory: b.statusHistory || [],
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

export function adaptCustomer(u) {
  if (!u) return null;
  const kyc = u.kycVerifications?.[0];
  const profile = u.customerProfile;

  return {
    ...u, // Preserve all raw backend fields
    id: u.id,
    name: u.name,
    phone: u.phone,
    email: u.email,
    role: u.role,
    status: u.status,
    gender: u.gender,
    dateOfBirth: u.dateOfBirth,
    avatarUrl: u.avatarUrl,
    authProvider: u.authProvider,
    isPhoneVerified: u.isPhoneVerified,
    isKycVerified: profile?.isKycVerified || kyc?.status === 'VERIFIED',
    kycStatus: kyc?.status || (profile?.isKycVerified ? 'VERIFIED' : 'PENDING'),
    kycId: kyc?.id,
    kycRejectionReason: kyc?.rejectionReason || profile?.kycRejectionReason,
    licenseNumber: profile?.licenseNumber || '',
    licenseCategories: profile?.licenseCategories || [],
    hasCarLicense: profile?.hasCarLicense || false,
    hasBikeLicense: profile?.hasBikeLicense || false,
    aadhaarMasked: profile?.aadhaarNumberMasked || '',
    emergencyName: profile?.emergencyName || '',
    emergencyPhone: profile?.emergencyPhone || '',
    emergencyRelation: profile?.emergencyRelation || '',
    preferredLanguage: profile?.preferredLanguage || 'English',
    bookingsCount: u._count?.bookingsAsCustomer ?? u.bookingsAsCustomer?.length ?? 0,
    lastLoginAt: u.lastLoginAt,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export function adaptOwner(u) {
  if (!u) return null;
  const profile = u.ownerProfile;

  return {
    ...u, // Preserve all raw backend fields
    id: u.id,
    name: u.name,
    phone: u.phone,
    email: u.email,
    role: u.role,
    businessName: profile?.businessName || u.name,
    businessRegistrationNumber: profile?.businessRegistrationNumber || '',
    taxId: profile?.taxId || '',
    ownerType: profile?.ownerType || 'INDIVIDUAL',
    bankVerified: profile?.bankAccountVerified || false,
    status: u.status,
    vehiclesCount: u._count?.vehiclesOwned ?? u.vehiclesOwned?.length ?? profile?.totalVehicles ?? 0,
    totalEarnings: Number(u._sum?.ownerPayables?.netPayableAmount || 0),
    rating: 4.8,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export function adaptBanner(b) {
  if (!b) return null;
  return {
    ...b,
    id: b.id,
    title: b.title,
    subtitle: b.subtitle || '',
    imageUrl: b.imageUrl,
    targetUrl: b.targetUrl || '',
    position: b.position,
    sortOrder: b.sortOrder || 0,
    isActive: b.isActive,
    startDate: b.startDate,
    endDate: b.endDate,
    createdAt: b.createdAt,
  };
}

export function adaptOffer(o) {
  if (!o) return null;
  return {
    ...o,
    id: o.id,
    code: o.code || o.offerCode || '',
    title: o.title || o.name || '',
    tagline: o.tagline || '',
    description: o.description || '',
    discountType: o.discountType || 'PERCENTAGE',
    discountValue: Number(o.discountValue || 0),
    maxDiscount: o.maxDiscountAmount ? Number(o.maxDiscountAmount) : null,
    maxDiscountAmount: o.maxDiscountAmount ? Number(o.maxDiscountAmount) : null,
    minBookingAmount: o.minBookingAmount ? Number(o.minBookingAmount) : 0,
    applicableVehicleCategories: o.applicableCategory ? [o.applicableCategory] : (o.applicableVehicleCategories || []),
    applicableCities: o.applicableCities || [],
    isFirstBookingOnly: o.isFirstBookingOnly || false,
    maxUsagePerUser: o.maxUsagePerUser || o.usageLimitPerUser || null,
    maxTotalUsage: o.maxTotalUsage || o.usageLimit || null,
    usedCount: o.usedCount || 0,
    validFrom: o.startDate || o.validFrom,
    validUntil: o.endDate || o.validUntil,
    termsAndConditions: o.termsAndConditions || '',
    isActive: o.isActive,
    createdAt: o.createdAt,
  };
}

export function adaptSubscription(s) {
  if (!s) return null;
  return {
    ...s,
    id: s.id,
    subscriptionNumber: s.subscriptionNumber || s.id?.slice(0, 8),
    planName: s.plan?.name || 'Commuter Pass',
    planPrice: Number(s.plan?.price || 0),
    planCode: s.plan?.code || '',
    billingInterval: s.plan?.billingInterval || 'MONTHLY',
    durationDays: s.plan?.durationDays || 30,
    includedHours: Number(s.plan?.includedHours || 0),
    includedKm: Number(s.plan?.includedKm || 0),
    maxBookings: s.plan?.maxBookings || null,
    maxActiveBookings: s.plan?.maxActiveBookings || null,
    status: s.status,
    userName: s.user?.name || 'Subscriber',
    userPhone: s.user?.phone || '',
    userEmail: s.user?.email || '',
    periodStart: s.currentPeriodStart || s.startedAt,
    periodEnd: s.currentPeriodEnd,
    autoRenew: s.autoRenew,
    cancelledReason: s.cancelledReason,
    createdAt: s.createdAt,
  };
}

export function adaptSupportTicket(t) {
  if (!t) return null;
  return {
    ...t,
    id: t.id,
    ticketId: t.id?.slice(0, 8).toUpperCase(),
    subject: t.subject,
    description: t.description,
    category: t.category,
    priority: t.priority,
    status: t.status,
    userName: t.user?.name || 'User',
    userPhone: t.user?.phone || '',
    userEmail: t.user?.email || '',
    userRole: t.user?.role || 'CUSTOMER',
    bookingId: t.bookingId,
    vehicleId: t.vehicleId,
    assignedTo: t.assignedTo,
    assignedUserName: t.assignedUser?.name || null,
    resolvedAt: t.resolvedAt,
    messagesCount: t.messages?.length || 0,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

export function adaptAuditLog(a) {
  if (!a) return null;
  return {
    ...a,
    id: a.id,
    action: a.action,
    entityType: a.entityType,
    entityId: a.entityId,
    actorName: a.actor?.name || 'System Admin',
    actorEmail: a.actor?.email || '',
    oldValues: a.oldValues,
    newValues: a.newValues,
    ipAddress: a.ipAddress || '',
    userAgent: a.userAgent || '',
    message: a.newValues?.message || a.action,
    createdAt: a.createdAt,
  };
}

export const adaptTicket = adaptSupportTicket;
