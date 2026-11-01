/**
 * Navigation & URL Routing Helper for Country Drive Admin Panel
 * Synchronizes application tabs with HTML5 browser history and URL paths.
 */

const VALID_TABS = [
  'dashboard',
  'vehicles',
  'bookings',
  'users',
  'customers',
  'kyc',
  'owners',
  'vendors',
  'banners',
  'offers',
  'coupons',
  'subscriptions',
  'pricing',
  'payments',
  'support',
  'reviews',
  'notifications',
  'reports',
  'audit',
  'settings',
];

/**
 * Converts an internal activeTab string to a clean browser URL pathname.
 * e.g., 'dashboard' -> '/'
 *       'vehicles' -> '/vehicles'
 *       'bookings:Pending' -> '/bookings/pending'
 *       'bookings:All' -> '/bookings'
 */
export function tabToPath(tab) {
  if (!tab || tab === 'dashboard') return '/';

  if (tab.startsWith('bookings:')) {
    const status = tab.split(':')[1];
    if (!status || status.toLowerCase() === 'all') {
      return '/bookings';
    }
    return `/bookings/${status.toLowerCase()}`;
  }

  return `/${encodeURIComponent(tab)}`;
}

/**
 * Resolves an activeTab identifier from the current window URL (pathname, hash, or query).
 */
export function pathToTab(pathname = window.location.pathname, hash = window.location.hash) {
  // 1. Check URL hash first (e.g., #/vehicles or #offers)
  const cleanHash = (hash || '').replace(/^#\/?/, '').trim();
  if (cleanHash) {
    if (cleanHash.startsWith('bookings/')) {
      const status = cleanHash.split('/')[1];
      if (status && status.toLowerCase() !== 'all') {
        const formatted = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        return `bookings:${formatted}`;
      }
      return 'bookings';
    }
    const matchedHash = VALID_TABS.find((t) => t.toLowerCase() === cleanHash.toLowerCase());
    if (matchedHash) return matchedHash;
  }

  // 2. Check URL pathname (e.g., /vehicles or /bookings/pending)
  const cleanPath = (pathname || window.location.pathname)
    .replace(/^\/+|\/+$/g, '')
    .trim();

  if (!cleanPath || cleanPath === 'dashboard' || cleanPath === 'index.html') {
    return 'dashboard';
  }

  // Handle /bookings/pending, /bookings/confirmed, /bookings/active, etc.
  if (cleanPath.startsWith('bookings/')) {
    const status = cleanPath.split('/')[1];
    if (status && status.toLowerCase() !== 'all') {
      const formatted = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      return `bookings:${formatted}`;
    }
    return 'bookings';
  }

  // Handle direct encoded format e.g. bookings:Pending
  if (cleanPath.startsWith('bookings:')) {
    return decodeURIComponent(cleanPath);
  }

  // 3. Match against known valid tabs
  const matchedTab = VALID_TABS.find((t) => t.toLowerCase() === cleanPath.toLowerCase());
  if (matchedTab) {
    // Aliases normalization
    if (matchedTab === 'customers' || matchedTab === 'kyc') return 'users';
    if (matchedTab === 'vendors') return 'owners';
    if (matchedTab === 'coupons') return 'offers';
    if (matchedTab === 'reviews') return 'support';
    return matchedTab;
  }

  // 4. Check query parameter fallback (e.g., ?tab=vehicles)
  try {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && VALID_TABS.includes(tabParam.toLowerCase())) {
      return tabParam.toLowerCase();
    }
  } catch (e) {
    // ignore
  }

  // 5. Fallback to session/localStorage if available
  try {
    const saved = sessionStorage.getItem('countrydrive_active_tab') || localStorage.getItem('countrydrive_active_tab');
    if (saved && VALID_TABS.some((t) => saved.startsWith(t))) {
      return saved;
    }
  } catch (e) {
    // ignore
  }

  return 'dashboard';
}
