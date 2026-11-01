import React, { useState, useEffect } from 'react';
import {
  Percent,
  Tag,
  Calendar,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Clock,
  Trash2,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  BarChart3,
  Edit2,
  Users,
  IndianRupee,
  Car,
  FileText,
} from 'lucide-react';
import { offersApi } from '../services/offersApi.js';
import { adaptOffer } from '../utils/adapters.js';

export const OffersView = () => {
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  // Filters
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'PERCENTAGE' | 'FIXED'
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [usageStatsModal, setUsageStatsModal] = useState(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields (used for both create and edit)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [offerCode, setOfferCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE'); // 'PERCENTAGE' | 'FIXED'
  const [discountValue, setDiscountValue] = useState(20);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(1500);
  const [minBookingAmount, setMinBookingAmount] = useState(3000);
  const [categories, setCategories] = useState(['SUV', 'SEDAN', 'HATCHBACK']);
  const [isFirstBookingOnly, setIsFirstBookingOnly] = useState(false);
  const [maxUsagePerUser, setMaxUsagePerUser] = useState(1);
  const [maxTotalUsage, setMaxTotalUsage] = useState(500);
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [terms, setTerms] = useState('Valid on all self-drive bookings above minimum threshold.');

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filterType !== 'ALL') params.discountType = filterType;
      if (filterStatus === 'ACTIVE') params.isActive = 'true';
      if (filterStatus === 'INACTIVE') params.isActive = 'false';
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const [res, statsRes] = await Promise.allSettled([
        offersApi.getOffers(params),
        offersApi.getOverviewStats(),
      ]);

      if (res.status === 'fulfilled') {
        const raw = Array.isArray(res.value?.data) ? res.value.data : res.value?.data?.offers || [];
        setOffers(raw.map(adaptOffer).filter(Boolean));
      }

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value?.data || null);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [filterType, filterStatus]);

  const openCreateModal = () => {
    setTitle('');
    setDescription('');
    setOfferCode('');
    setDiscountType('PERCENTAGE');
    setDiscountValue(20);
    setMaxDiscountAmount(1500);
    setMinBookingAmount(3000);
    setCategories(['SUV', 'SEDAN', 'HATCHBACK']);
    setIsFirstBookingOnly(false);
    setMaxUsagePerUser(1);
    setMaxTotalUsage(500);
    
    // Default start now and end 30 days from now
    const now = new Date();
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    setStartAt(now.toISOString().slice(0, 16));
    setEndAt(in30Days.toISOString().slice(0, 16));
    
    setIsActive(true);
    setTerms('Valid on all self-drive bookings above minimum threshold.');
    setEditingOffer(null);
    setErrorMsg('');
    setShowCreateModal(true);
  };

  const openEditModal = (o) => {
    setEditingOffer(o);
    setTitle(o.title || o.name || '');
    setDescription(o.description || '');
    setOfferCode(o.code || o.offerCode || '');
    setDiscountType(o.discountType || 'PERCENTAGE');
    setDiscountValue(Number(o.discountValue) || 10);
    setMaxDiscountAmount(o.maxDiscountAmount ? Number(o.maxDiscountAmount) : '');
    setMinBookingAmount(o.minBookingAmount ? Number(o.minBookingAmount) : '');
    setCategories(Array.isArray(o.applicableVehicleCategories) && o.applicableVehicleCategories.length > 0 ? o.applicableVehicleCategories : ['SUV', 'SEDAN']);
    setIsFirstBookingOnly(o.isFirstBookingOnly ?? false);
    setMaxUsagePerUser(o.maxUsagePerUser ? Number(o.maxUsagePerUser) : '');
    setMaxTotalUsage(o.maxTotalUsage ? Number(o.maxTotalUsage) : '');

    const start = o.validFrom || o.startDate;
    const end = o.validUntil || o.endDate;
    setStartAt(start ? new Date(start).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
    setEndAt(end ? new Date(end).toISOString().slice(0, 16) : new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16));

    setIsActive(o.isActive ?? true);
    setTerms(o.termsAndConditions || '');
    setErrorMsg('');
    setShowCreateModal(true);
  };

  const openUsageStats = async (offerId) => {
    setIsLoadingUsage(true);
    setUsageStatsModal({ id: offerId, loading: true });
    try {
      const res = await offersApi.getUsageStats(offerId);
      setUsageStatsModal(res.data || res);
    } catch (err) {
      console.error('Failed to get offer usage:', err);
      alert(err.message || 'Failed to load usage statistics');
      setUsageStatsModal(null);
    } finally {
      setIsLoadingUsage(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = async (id, currentActive) => {
    try {
      await offersApi.toggleActive(id);
      setOffers((prev) =>
        prev.map((o) => (o.id === id ? { ...o, isActive: !currentActive } : o))
      );
      setSuccessMsg(`Promo offer ${!currentActive ? 'activated' : 'paused'} successfully.`);
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error('Toggle error:', err);
      setErrorMsg(err.message || 'Failed to toggle offer status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotional coupon?')) return;
    try {
      await offersApi.delete(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
      setSuccessMsg('Promo coupon deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Failed to delete offer');
    }
  };

  const handleSaveOffer = async (e) => {
    e.preventDefault();

    // Client-side validations
    const cleanTitle = title.trim();
    const cleanCode = offerCode.trim().toUpperCase();

    if (!cleanCode || cleanCode.length < 3) {
      setErrorMsg('Promo Code must be at least 3 characters long (e.g. MONSOON20).');
      return;
    }
    if (!cleanTitle || cleanTitle.length < 3) {
      setErrorMsg('Offer Title must be at least 3 characters long.');
      return;
    }

    const numDiscount = Number(discountValue);
    if (isNaN(numDiscount) || numDiscount <= 0) {
      setErrorMsg('Discount Value must be a positive number greater than 0.');
      return;
    }
    if (discountType === 'PERCENTAGE' && numDiscount > 100) {
      setErrorMsg('Percentage discount cannot exceed 100%.');
      return;
    }

    // Date validations
    let startIso;
    let endIso;
    try {
      const sDate = startAt ? new Date(startAt) : new Date();
      const eDate = endAt ? new Date(endAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      if (isNaN(sDate.getTime())) throw new Error('Invalid Start Date & Time');
      if (isNaN(eDate.getTime())) throw new Error('Invalid Expiry Date & Time');
      if (eDate <= sDate) throw new Error('Expiry Date must be after Start Date');

      startIso = sDate.toISOString();
      endIso = eDate.toISOString();
    } catch (dateErr) {
      setErrorMsg(dateErr.message || 'Please check start and end dates.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        title: cleanTitle,
        description: description.trim() || undefined,
        offerCode: cleanCode,
        discountType,
        discountValue: numDiscount,
        maxDiscountAmount: maxDiscountAmount && Number(maxDiscountAmount) > 0 ? Number(maxDiscountAmount) : undefined,
        minBookingAmount: minBookingAmount && Number(minBookingAmount) > 0 ? Number(minBookingAmount) : undefined,
        applicableVehicleCategories: categories.length > 0 ? categories : undefined,
        isFirstBookingOnly: !!isFirstBookingOnly,
        maxUsagePerUser: maxUsagePerUser && Number(maxUsagePerUser) > 0 ? Number(maxUsagePerUser) : undefined,
        maxTotalUsage: maxTotalUsage && Number(maxTotalUsage) > 0 ? Number(maxTotalUsage) : undefined,
        startAt: startIso,
        endAt: endIso,
        isActive: !!isActive,
        termsAndConditions: terms.trim() || undefined,
      };

      if (editingOffer) {
        await offersApi.update(editingOffer.id, payload);
        setSuccessMsg('Promo offer updated successfully!');
      } else {
        await offersApi.create(payload);
        setSuccessMsg('Promo offer created and published successfully!');
      }

      setShowCreateModal(false);
      setEditingOffer(null);
      fetchOffers();
    } catch (err) {
      console.error('Save offer error:', err);
      setErrorMsg(err.message || 'Failed to save promo offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allCategories = ['SUV', 'SEDAN', 'HATCHBACK', 'LUXURY', 'MOTORBIKE', 'SCOOTY'];

  const toggleCategory = (cat) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
            <Percent className="text-[#00D26A]" size={24} />
            <span>Discounts & Promotional Offers</span>
          </h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Full backend schema: percentage/fixed discounts, max caps, vehicle eligibility, user limits & redemption analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchOffers}
            className="px-3.5 py-2.5 rounded-xl bg-[#121e19] hover:bg-[#172721] border border-[#1c3229] text-xs font-semibold text-[#8ba398] hover:text-white flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#00D26A]' : ''} />
            <span>Sync</span>
          </button>
          <button
            onClick={openCreateModal}
            className="btn-glossy btn-glossy-emerald px-4 py-2.5 text-xs rounded-xl flex items-center gap-1.5 font-bold text-black"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Create Promo Coupon</span>
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[#00D26A] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-[#8ba398] hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Active Campaigns</span>
          <span className="text-xl font-bold text-white mt-1 block">
            {stats?.overview?.activeOffers ?? offers.filter((o) => o.isActive).length}
          </span>
          <span className="text-[10px] text-emerald-400">Live for Customers</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Total Coupons</span>
          <span className="text-xl font-bold text-[#00D26A] mt-1 block">
            {stats?.overview?.totalOffers ?? offers.length}
          </span>
          <span className="text-[10px] text-[#8ba398]">All-time Configured</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Total Discounts Given</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">
            ₹{Number(stats?.performance?.totalDiscountsGiven || 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-[#8ba398]">Customer Savings</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Expired / Archived</span>
          <span className="text-xl font-bold text-zinc-400 mt-1 block">
            {stats?.overview?.expiredOffers ?? 0}
          </span>
          <span className="text-[10px] text-[#8ba398]">Past Validity</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#121e19] p-3 rounded-2xl border border-[#1c3229]">
        {/* Type & Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['ALL', 'PERCENTAGE', 'FIXED'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === t
                  ? 'bg-[#00D26A] text-black font-bold'
                  : 'text-[#8ba398] hover:text-white bg-[#0e1713] border border-[#1c3229]'
              }`}
            >
              {t === 'ALL' ? 'All Types' : t === 'PERCENTAGE' ? 'Percentage %' : 'Flat ₹ Amount'}
            </button>
          ))}
          <div className="w-[1px] h-6 bg-[#1c3229] mx-1" />
          {['ALL', 'ACTIVE', 'INACTIVE'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === s
                  ? 'bg-emerald-500/20 text-[#00D26A] border border-[#00D26A]/40'
                  : 'text-[#8ba398] hover:text-white bg-[#0e1713] border border-[#1c3229]'
              }`}
            >
              {s === 'ALL' ? 'All Status' : s === 'ACTIVE' ? 'Active' : 'Paused'}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOffers();
          }}
          className="relative flex-1 sm:w-64"
        >
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#577064]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code or title..."
            className="w-full bg-[#0e1713] border border-[#1c3229] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#577064] focus:outline-none focus:border-[#00D26A]"
          />
        </form>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div
              key={offer.id}
              onClick={() => openUsageStats(offer.id)}
              className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-5 space-y-4 hover:border-[#00D26A] hover:shadow-[0_0_20px_rgba(0,210,106,0.15)] transition-all duration-200 relative group flex flex-col justify-between cursor-pointer select-none"
              title="Click anywhere to inspect coupon details & live redemption analytics"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 rounded-xl bg-[#00D26A]/10 text-[#00D26A] border border-[#00D26A]/20">
                      <Tag size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#577064] uppercase tracking-wider block">
                        {offer.discountType === 'PERCENTAGE' ? 'PERCENT DISCOUNT' : 'FLAT OFF'}
                      </span>
                      <h3 className="font-bold text-white text-base leading-tight mt-0.5">
                        {offer.title || offer.name}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      offer.isActive
                        ? 'bg-emerald-500/20 text-[#00D26A] border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {offer.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>

                {/* Promo Code Box */}
                <div className="flex items-center justify-between bg-[#0e1713] border border-[#1c3229] rounded-xl p-2.5 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#00D26A] tracking-wider select-all">
                      {offer.code}
                    </span>
                    {offer.isFirstBookingOnly && (
                      <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        1st Ride Only
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(offer.code);
                    }}
                    className="p-1.5 hover:bg-[#1c3229] rounded-lg text-[#8ba398] hover:text-white transition-colors"
                    title="Copy Promo Code"
                  >
                    {copiedCode === offer.code ? (
                      <Check size={14} className="text-[#00D26A]" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-[#8ba398] line-clamp-2 mt-3">
                  {offer.description || 'Flat promotional discount applied on qualified vehicle reservations.'}
                </p>

                {/* Technical Parameters Pill Grid */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#1c3229] text-[11px]">
                  <div>
                    <span className="text-[#577064] block text-[10px]">Discount Value</span>
                    <span className="font-bold text-white font-mono">
                      {offer.discountType === 'PERCENTAGE'
                        ? `${offer.discountValue}% OFF`
                        : `₹${offer.discountValue} OFF`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#577064] block text-[10px]">Max Discount Cap</span>
                    <span className="font-bold text-white font-mono">
                      {offer.maxDiscountAmount ? `₹${offer.maxDiscountAmount}` : 'No Limit'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#577064] block text-[10px]">Min Booking Threshold</span>
                    <span className="font-bold text-white font-mono">
                      {offer.minBookingAmount ? `₹${offer.minBookingAmount}` : '₹0'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#577064] block text-[10px]">Usage / User</span>
                    <span className="font-bold text-white font-mono">
                      {offer.maxUsagePerUser ? `${offer.maxUsagePerUser} ride` : 'Unlimited'}
                    </span>
                  </div>
                </div>

                {/* Categories */}
                {Array.isArray(offer.applicableVehicleCategories) && offer.applicableVehicleCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {offer.applicableVehicleCategories.map((c) => (
                      <span
                        key={c}
                        className="bg-[#121e19] text-[#8ba398] border border-[#1c3229] px-2 py-0.5 rounded-md text-[10px] font-semibold"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Validity Period */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#577064] mt-3">
                  <Calendar size={12} />
                  <span>
                    Valid: {offer.validFrom ? new Date(offer.validFrom).toLocaleDateString() : 'Active'}
                    {' → '}
                    {offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'Indefinite'}
                  </span>
                </div>
              </div>

              {/* Card Footer Toolbar */}
              <div className="pt-3 border-t border-[#1c3229] flex items-center justify-between text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openUsageStats(offer.id);
                  }}
                  className="px-2.5 py-1 text-xs text-[#8ba398] hover:text-[#00D26A] flex items-center gap-1 hover:bg-[#1c3229] rounded-lg transition-colors font-semibold"
                >
                  <BarChart3 size={13} />
                  <span>Usage Stats ({offer.usedCount || 0})</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(offer);
                    }}
                    className="p-1.5 text-[#8ba398] hover:text-white hover:bg-[#1c3229] rounded-lg transition-colors"
                    title="Edit Promo Offer"
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(offer.id, offer.isActive);
                    }}
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
                      offer.isActive ? 'text-[#00D26A] hover:bg-emerald-500/10' : 'text-zinc-500 hover:bg-zinc-800'
                    }`}
                  >
                    {offer.isActive ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
                    <span>{offer.isActive ? 'Live' : 'Paused'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(offer.id);
                    }}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Promo Coupon"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-[#8ba398] bg-[#121e19] rounded-2xl border border-[#1c3229] space-y-3">
            <Tag size={36} className="mx-auto text-[#577064]" />
            <p className="text-sm font-semibold text-white">No promotional offers found</p>
            <p className="text-xs text-[#8ba398]">No promo coupons match your criteria. Click below to create one.</p>
            <button
              onClick={openCreateModal}
              className="btn-glossy btn-glossy-emerald px-4 py-2 text-xs rounded-xl font-bold text-black inline-flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Create Promo Coupon</span>
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1c3229] pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Tag size={16} className="text-[#00D26A]" />
                  <span>{editingOffer ? 'Edit Promo Coupon' : 'Create New Promotional Offer'}</span>
                </h3>
                <p className="text-xs text-[#8ba398]">
                  Define discount algorithm, user redemption limits, category eligibility & schedule
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingOffer(null);
                }}
                className="text-[#8ba398] hover:text-white"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveOffer} className="space-y-4 text-xs">
              {/* Promo Code & Title */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Coupon Promo Code *</label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={50}
                    value={offerCode}
                    onChange={(e) => setOfferCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    placeholder="e.g. MONSOON30, DIWALI2026"
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-[#00D26A]"
                  />
                  <span className="text-[10px] text-[#577064]">Letters and numbers, min 3 chars</span>
                </div>
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Offer Title *</label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={200}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 20% Monsoon Getaway"
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#8ba398] font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Flat 20% off on all SUV & Sedan self-drive rentals."
                  className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                />
              </div>

              {/* Discount Type, Value, Max Cap */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Discount Type *</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                  >
                    <option value="PERCENTAGE">PERCENTAGE (%)</option>
                    <option value="FIXED">FIXED AMOUNT (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">
                    Value {discountType === 'PERCENTAGE' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={discountType === 'PERCENTAGE' ? 100 : 100000}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
              </div>

              {/* Min Booking Value, Limits */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minBookingAmount}
                    onChange={(e) => setMinBookingAmount(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Usage Limit / User</label>
                  <input
                    type="number"
                    min={1}
                    value={maxUsagePerUser}
                    onChange={(e) => setMaxUsagePerUser(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Total Campaign Cap</label>
                  <input
                    type="number"
                    min={1}
                    value={maxTotalUsage}
                    onChange={(e) => setMaxTotalUsage(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
              </div>

              {/* Vehicle Category Targets */}
              <div>
                <label className="block text-[#8ba398] font-semibold mb-1.5">Target Vehicle Categories</label>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1 rounded-lg font-semibold text-[11px] border transition-colors ${
                        categories.includes(cat)
                          ? 'bg-[#00D26A] text-black border-[#00D26A]'
                          : 'bg-[#121e19] text-[#8ba398] border-[#1c3229]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Expiry Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* First booking only flag & Active toggle */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="firstBooking"
                    checked={isFirstBookingOnly}
                    onChange={(e) => setIsFirstBookingOnly(e.target.checked)}
                    className="accent-[#00D26A] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="firstBooking" className="text-white cursor-pointer select-none">
                    First-time booking only promotion
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="offerActiveCheck"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-[#00D26A] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="offerActiveCheck" className="text-white cursor-pointer select-none">
                    Live Immediately
                  </label>
                </div>
              </div>

              {/* Terms and conditions */}
              <div>
                <label className="block text-[#8ba398] font-semibold mb-1">Terms & Conditions</label>
                <textarea
                  rows={2}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#1c3229]">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingOffer(null);
                  }}
                  className="px-4 py-2 text-xs text-[#8ba398] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-glossy btn-glossy-emerald px-6 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{editingOffer ? 'Update Promo Coupon' : 'Publish Promo Offer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Usage Statistics Breakdown Modal */}
      {usageStatsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-2xl p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1c3229] pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 size={17} className="text-[#00D26A]" />
                  <span>Promo Redemption & Revenue Analytics</span>
                </h3>
                <p className="text-xs text-[#8ba398]">
                  Code: <span className="font-mono text-[#00D26A] font-bold">{usageStatsModal.offer?.code}</span> — {usageStatsModal.offer?.name}
                </p>
              </div>
              <button onClick={() => setUsageStatsModal(null)} className="text-[#8ba398] hover:text-white">✕</button>
            </div>

            {isLoadingUsage ? (
              <div className="py-12 flex justify-center items-center text-[#00D26A]">
                <Loader2 size={24} className="animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#121e19] border border-[#1c3229] p-3 rounded-xl">
                    <span className="text-[10px] text-[#577064] uppercase font-bold block">Total Usages</span>
                    <span className="text-lg font-bold text-white mt-0.5 block">
                      {usageStatsModal.statistics?.totalUsage ?? 0}
                    </span>
                    <span className="text-[10px] text-[#8ba398]">
                      Limit: {usageStatsModal.offer?.usageLimit ?? 'No Cap'}
                    </span>
                  </div>
                  <div className="bg-[#121e19] border border-[#1c3229] p-3 rounded-xl">
                    <span className="text-[10px] text-[#577064] uppercase font-bold block">Unique Customers</span>
                    <span className="text-lg font-bold text-[#00D26A] mt-0.5 block">
                      {usageStatsModal.statistics?.uniqueUsers ?? 0}
                    </span>
                    <span className="text-[10px] text-emerald-400">Riders</span>
                  </div>
                  <div className="bg-[#121e19] border border-[#1c3229] p-3 rounded-xl">
                    <span className="text-[10px] text-[#577064] uppercase font-bold block">Discounts Given</span>
                    <span className="text-lg font-bold text-amber-400 mt-0.5 block">
                      ₹{Number(usageStatsModal.statistics?.totalDiscount || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#8ba398]">Saved by users</span>
                  </div>
                  <div className="bg-[#121e19] border border-[#1c3229] p-3 rounded-xl">
                    <span className="text-[10px] text-[#577064] uppercase font-bold block">Gross GMV Driven</span>
                    <span className="text-lg font-bold text-sky-400 mt-0.5 block">
                      ₹{Number(usageStatsModal.statistics?.totalRevenue || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#8ba398]">Booking volume</span>
                  </div>
                </div>

                {/* Recent Usages Table */}
                <div>
                  <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <Clock size={13} className="text-[#00D26A]" />
                    <span>Recent Customer Redemptions (Latest 10)</span>
                  </h4>

                  {Array.isArray(usageStatsModal.recentUsage) && usageStatsModal.recentUsage.length > 0 ? (
                    <div className="border border-[#1c3229] rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#121e19] text-[#577064] font-semibold border-b border-[#1c3229]">
                          <tr>
                            <th className="p-2.5">Customer</th>
                            <th className="p-2.5">Booking #</th>
                            <th className="p-2.5 text-right">Discount</th>
                            <th className="p-2.5 text-right">Gross Total</th>
                            <th className="p-2.5 text-right">Redeemed At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1c3229]">
                          {usageStatsModal.recentUsage.map((u) => (
                            <tr key={u.id} className="hover:bg-[#121e19]/50 transition-colors">
                              <td className="p-2.5">
                                <span className="font-semibold text-white block">{u.user?.name || 'Customer'}</span>
                                <span className="text-[10px] text-[#577064] font-mono">{u.user?.phone}</span>
                              </td>
                              <td className="p-2.5 font-mono text-[#00D26A] text-[11px]">
                                {u.booking?.bookingNumber || u.bookingId?.slice(0, 8)}
                              </td>
                              <td className="p-2.5 text-right font-mono font-bold text-emerald-400">
                                -₹{Number(u.discountAmount).toLocaleString('en-IN')}
                              </td>
                              <td className="p-2.5 text-right font-mono text-white">
                                ₹{Number(u.booking?.totalAmount || 0).toLocaleString('en-IN')}
                              </td>
                              <td className="p-2.5 text-right text-[11px] text-[#8ba398]">
                                {new Date(u.usedAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-[#8ba398] bg-[#121e19] rounded-xl border border-[#1c3229]">
                      This coupon has not been redeemed in any booking yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-[#1c3229]">
              <button
                onClick={() => setUsageStatsModal(null)}
                className="btn-glossy btn-glossy-emerald px-6 py-1.5 text-xs rounded-xl font-bold text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
