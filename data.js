// data.js
export const VENDOR_DATA = {
  owner: {
    id: "Anuj_7518",
    name: "Anuj Kumar Singh",
    phone: "+91 7518418939",
    kycStatus: "VERIFIED",
    bankDetails: {
      accountNo: "•••• •••• 4821",
      ifsc: "HDFC0001234",
      bankName: "HDFC Bank"
    }
  },

  pricingRules: {
    ownerPercentage: 0.80,
    platformPercentage: 0.20,
    extraKmRate: 12,
    lateFeePerHour: 150
  },

  stats: {
    totalRevenue: 48500,
    ownerEarnings: 38800,
    platformCommission: 9700,
    activeRentals: 3,
    totalVehicles: 4,
    pendingSettlement: 12400
  },

  vehicles: [
    {
      id: "VEH-101",
      name: "Hyundai Creta SX (Petrol)",
      regNumber: "KA-01-MJ-4321",
      category: "Four-Wheeler",
      fuelType: "Petrol",
      status: "ACTIVE",
      ratePerHour: 250,
      includedKmPerHour: 10,
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80",
      frontPhoto: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80",
      rearPhoto: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&q=80",
      leftPhoto: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&q=80",
      rightPhoto: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80",
      interiorPhoto: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&q=80",
      dashboardPhoto: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80",
      rejectionReason: null,
      totalTrips: 24,
      totalEarned: 28400
    },
    {
      id: "VEH-102",
      name: "Ather 450X (EV)",
      regNumber: "KA-03-EV-8899",
      category: "Two-Wheeler",
      fuelType: "EV",
      status: "ACTIVE",
      ratePerHour: 60,
      includedKmPerHour: 8,
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&q=80",
      frontPhoto: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&q=80",
      rearPhoto: "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?w=500&q=80",
      leftPhoto: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&q=80",
      rightPhoto: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80",
      interiorPhoto: null,
      dashboardPhoto: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&q=80",
      rejectionReason: null,
      totalTrips: 41,
      totalEarned: 11200
    },
    {
      id: "VEH-103",
      name: "Mahindra Thar 4x4 (Diesel)",
      regNumber: "KA-05-TH-9000",
      category: "Four-Wheeler",
      fuelType: "Diesel",
      status: "MAINTENANCE",
      ratePerHour: 450,
      includedKmPerHour: 12,
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&q=80",
      frontPhoto: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&q=80",
      rearPhoto: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80",
      leftPhoto: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80",
      rightPhoto: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&q=80",
      interiorPhoto: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&q=80",
      dashboardPhoto: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&q=80",
      rejectionReason: null,
      totalTrips: 12,
      totalEarned: 18900
    },
    {
      id: "VEH-104",
      name: "Honda Activa 6G (Petrol)",
      regNumber: "KA-02-HH-1122",
      category: "Two-Wheeler",
      fuelType: "Petrol",
      status: "REJECTED",
      ratePerHour: 45,
      includedKmPerHour: 6,
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&q=80",
      frontPhoto: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&q=80",
      rearPhoto: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&q=80",
      leftPhoto: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80",
      rightPhoto: "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?w=500&q=80",
      interiorPhoto: null,
      dashboardPhoto: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&q=80",
      rejectionReason: "Insurance document image is blurry. Please re-upload clear RC and Insurance.",
      totalTrips: 0,
      totalEarned: 0
    }
  ],

  bookings: [
    {
      id: "BK-8092",
      vehicleId: "VEH-101",
      vehicleName: "Hyundai Creta SX",
      customerName: "Rahul Verma",
      customerPhone: "+91 9123456789",
      faceVerified: true,
      pickupTime: "2026-10-26 10:00 AM",
      returnTime: "2026-10-26 08:00 PM",
      status: "ACTIVE",
      startOdometer: 24500,
      allowedKm: 100,
      grossAmount: 2500,
      ownerShare: 2000,
      platformShare: 500,
      startFuel: "85%"
    },
    {
      id: "BK-8095",
      vehicleId: "VEH-102",
      vehicleName: "Ather 450X EV",
      customerName: "Priya Sharma",
      customerPhone: "+91 9988776655",
      faceVerified: true,
      pickupTime: "2026-10-26 02:00 PM",
      returnTime: "2026-10-27 02:00 PM",
      status: "RETURN_PENDING",
      startOdometer: 8200,
      allowedKm: 150,
      grossAmount: 1440,
      ownerShare: 1152,
      platformShare: 288,
      startFuel: "98% Charge"
    },
    {
      id: "BK-8080",
      vehicleId: "VEH-101",
      vehicleName: "Hyundai Creta SX",
      customerName: "Amit Kumar",
      customerPhone: "+91 9811223344",
      faceVerified: true,
      pickupTime: "2026-10-24 09:00 AM",
      returnTime: "2026-10-24 05:00 PM",
      status: "COMPLETED",
      startOdometer: 24350,
      endOdometer: 24480,
      allowedKm: 100,
      grossAmount: 2360,
      ownerShare: 1888,
      platformShare: 472,
      startFuel: "80%",
      endFuel: "80%"
    }
  ],

  ledger: [
    {
      id: "TX-901",
      date: "2026-10-25",
      bookingId: "BK-8080",
      type: "RENTAL_CREDIT",
      grossAmount: 2360,
      ownerEarning: 1888,
      platformFee: 472,
      status: "SETTLED"
    },
    {
      id: "TX-899",
      date: "2026-10-22",
      bookingId: "BK-7990",
      type: "SETTLEMENT_PAYOUT",
      grossAmount: 15000,
      ownerEarning: 12000,
      platformFee: 3000,
      status: "TRANSFERRED_TO_BANK"
    }
  ]
};

export const calculateRevenueSplit = (amount) => {
  const gross = parseFloat(amount) || 0;
  const ownerShare = gross * VENDOR_DATA.pricingRules.ownerPercentage;
  const platformShare = gross * VENDOR_DATA.pricingRules.platformPercentage;
  return { gross, ownerShare, platformShare };
};