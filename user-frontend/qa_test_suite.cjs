const BASE_URL = 'http://localhost:4000/api/v1';

async function runTests() {
  const results = {
    passed: [],
    failed: [],
    blockedByBackend: []
  };

  const logResult = (name, ok, details) => {
    if (ok) {
      console.log(`[PASS] ${name}`);
      results.passed.push({ name, details });
    } else {
      console.log(`[FAIL/ISSUE] ${name}:`, details);
      results.failed.push({ name, details });
    }
  };

  console.log('=== 1. PUBLIC ENDPOINTS ===');

  // Health
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const json = await res.json();
    logResult('GET /health', res.ok && json.success === true, json);
  } catch (e) {
    logResult('GET /health', false, e.message);
  }

  // Vehicles Catalog
  let sampleVehicleId = null;
  try {
    const res = await fetch(`${BASE_URL}/vehicles`);
    const json = await res.json();
    const isArray = Array.isArray(json.data);
    if (isArray && json.data.length > 0) sampleVehicleId = json.data[0].id;
    logResult('GET /vehicles', res.ok, { count: isArray ? json.data.length : 0, sampleId: sampleVehicleId });
  } catch (e) {
    logResult('GET /vehicles', false, e.message);
  }

  // Vehicles Nearby (PostGIS)
  try {
    const res = await fetch(`${BASE_URL}/vehicles/nearby?lat=19.0760&lng=72.8777&radiusKm=25`);
    const json = await res.json();
    logResult('GET /vehicles/nearby', res.ok, { count: Array.isArray(json.data) ? json.data.length : (json.message || 'non-array') });
  } catch (e) {
    logResult('GET /vehicles/nearby', false, e.message);
  }

  // Single Vehicle (if sample exists)
  if (sampleVehicleId) {
    try {
      const res = await fetch(`${BASE_URL}/vehicles/${sampleVehicleId}`);
      const json = await res.json();
      logResult(`GET /vehicles/:id (${sampleVehicleId})`, res.ok, { name: json.data?.make + ' ' + json.data?.model });
    } catch (e) {
      logResult(`GET /vehicles/:id`, false, e.message);
    }

    try {
      const res = await fetch(`${BASE_URL}/vehicles/${sampleVehicleId}/reviews`);
      const json = await res.json();
      logResult(`GET /vehicles/:id/reviews`, res.ok, { count: Array.isArray(json.data) ? json.data.length : 0 });
    } catch (e) {
      logResult(`GET /vehicles/:id/reviews`, false, e.message);
    }
  }

  // Offers
  try {
    const res = await fetch(`${BASE_URL}/offers`);
    const json = await res.json();
    logResult('GET /offers', res.ok, { offers: Array.isArray(json.data) ? json.data.length : json });
  } catch (e) {
    logResult('GET /offers', false, e.message);
  }

  // Banners
  try {
    const res = await fetch(`${BASE_URL}/banners`);
    const json = await res.json();
    logResult('GET /banners', res.ok, { banners: Array.isArray(json.data) ? json.data.length : json });
  } catch (e) {
    logResult('GET /banners', false, e.message);
  }

  // Subscription Plans
  try {
    const res = await fetch(`${BASE_URL}/subscriptions/plans`);
    const json = await res.json();
    logResult('GET /subscriptions/plans', res.ok, { plans: Array.isArray(json.data) ? json.data.length : json });
  } catch (e) {
    logResult('GET /subscriptions/plans', false, e.message);
  }

  console.log('\n=== 2. AUTHENTICATION & USER PROFILE FLOW ===');

  const testPhone = `+9199999${Math.floor(10000 + Math.random() * 90000)}`;
  const testPassword = 'Password@123';
  let authToken = null;
  let userId = null;

  // Register
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'QA Test User',
        phone: testPhone,
        password: testPassword,
        email: `qatest_${Date.now()}@example.com`
      })
    });
    const json = await res.json();
    if (json.data?.token || json.data?.accessToken) {
      authToken = json.data.token || json.data.accessToken;
      userId = json.data.user?.id;
    }
    logResult('POST /auth/register', res.ok || res.status === 201, { status: res.status, msg: json.message });
  } catch (e) {
    logResult('POST /auth/register', false, e.message);
  }

  // Login
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: testPhone,
        password: testPassword
      })
    });
    const json = await res.json();
    if (json.data?.token || json.data?.accessToken) {
      authToken = json.data.token || json.data.accessToken;
      userId = json.data.user?.id;
    }
    logResult('POST /auth/login', res.ok, { status: res.status, tokenAcquired: !!authToken });
  } catch (e) {
    logResult('POST /auth/login', false, e.message);
  }

  if (authToken) {
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    };

    // GET /auth/me
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders });
      const json = await res.json();
      logResult('GET /auth/me', res.ok, { name: json.data?.name, phone: json.data?.phone });
    } catch (e) {
      logResult('GET /auth/me', false, e.message);
    }

    // PATCH /auth/me (Profile update with emergency contact)
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({
          name: 'QA Test User Updated',
          emergencyContact: '+919888877777',
          emergencyContactName: 'Parent',
          emergencyContactRelation: 'FATHER'
        })
      });
      const json = await res.json();
      logResult('PATCH /auth/me', res.ok, { name: json.data?.name, emergencyContact: json.data?.emergencyContact });
    } catch (e) {
      logResult('PATCH /auth/me', false, e.message);
    }

    console.log('\n=== 3. KYC FLOW ===');

    // GET /kyc/status
    try {
      const res = await fetch(`${BASE_URL}/kyc/status`, { headers: authHeaders });
      const json = await res.json();
      logResult('GET /kyc/status', res.ok, { status: json.data?.status || json.data });
    } catch (e) {
      logResult('GET /kyc/status', false, e.message);
    }

    // POST /kyc/details
    try {
      const res = await fetch(`${BASE_URL}/kyc/details`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          fullName: 'QA Test User',
          dateOfBirth: '1995-05-15',
          licenseNumber: 'MH0220180012345',
          licenseCategories: ['LMV', 'MCWG'],
          licenseExpiry: '2035-05-15'
        })
      });
      const json = await res.json();
      logResult('POST /kyc/details', res.ok || res.status === 201, { status: res.status, msg: json.message });
    } catch (e) {
      logResult('POST /kyc/details', false, e.message);
    }

    // GET /kyc/documents
    try {
      const res = await fetch(`${BASE_URL}/kyc/documents`, { headers: authHeaders });
      const json = await res.json();
      logResult('GET /kyc/documents', res.ok, { docs: Array.isArray(json.data) ? json.data.length : json });
    } catch (e) {
      logResult('GET /kyc/documents', false, e.message);
    }

    console.log('\n=== 4. COUPONS, BOOKINGS & RENTALS ===');

    // POST /coupons/validate
    try {
      const res = await fetch(`${BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          code: 'WELCOME50',
          amount: 2500,
          vehicleCategory: 'CAR'
        })
      });
      const json = await res.json();
      logResult('POST /coupons/validate', res.ok, { valid: json.data?.valid || json.success, discount: json.data?.discountAmount || json.message });
    } catch (e) {
      logResult('POST /coupons/validate', false, e.message);
    }

    // GET /bookings
    try {
      const res = await fetch(`${BASE_URL}/bookings`, { headers: authHeaders });
      const json = await res.json();
      logResult('GET /bookings', res.ok, { count: Array.isArray(json.data) ? json.data.length : json });
    } catch (e) {
      logResult('GET /bookings', false, e.message);
    }

    console.log('\n=== 5. NOTIFICATIONS, SUPPORT & SUBSCRIPTIONS ===');

    // GET /notifications/unread-count
    try {
      const res = await fetch(`${BASE_URL}/notifications/unread-count`, { headers: authHeaders });
      const json = await res.json();
      logResult('GET /notifications/unread-count', res.ok, { unreadCount: json.data?.unreadCount || json.data?.count || json.data });
    } catch (e) {
      logResult('GET /notifications/unread-count', false, e.message);
    }

    // GET /notifications
    try {
      const res = await fetch(`${BASE_URL}/notifications`, { headers: authHeaders });
      const json = await res.json();
      logResult('GET /notifications', res.ok, { count: Array.isArray(json.data) ? json.data.length : json });
    } catch (e) {
      logResult('GET /notifications', false, e.message);
    }

    // GET /subscriptions/my-subscription
    try {
      const res = await fetch(`${BASE_URL}/subscriptions/my-subscription`, { headers: authHeaders });
      const json = await res.json();
      logResult('GET /subscriptions/my-subscription', res.ok, { subscription: json.data });
    } catch (e) {
      logResult('GET /subscriptions/my-subscription', false, e.message);
    }

    // GET /support/tickets
    try {
      const res = await fetch(`${BASE_URL}/support/tickets`, { headers: authHeaders });
      const json = await res.json();
      logResult('GET /support/tickets', res.ok, { count: Array.isArray(json.data) ? json.data.length : json });
    } catch (e) {
      logResult('GET /support/tickets', false, e.message);
    }

    // GET /disputes
    try {
      const res = await fetch(`${BASE_URL}/disputes`, { headers: authHeaders });
      const json = await res.json();
      logResult('GET /disputes', res.ok, { count: Array.isArray(json.data) ? json.data.length : json });
    } catch (e) {
      logResult('GET /disputes', false, e.message);
    }
  }

  console.log('\n==================================');
  console.log(`PASSED: ${results.passed.length}`);
  console.log(`FAILED/ISSUES: ${results.failed.length}`);
  console.log('==================================');
}

runTests();
