import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Plus,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  Trash2,
  CheckCircle2,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
  Calendar,
  Upload,
  Search,
  Filter,
  Edit2,
  Layers,
  ArrowUpDown,
  User,
  Clock,
  X,
  Link2,
} from 'lucide-react';
import { bannersApi } from '../services/bannersApi.js';
import { uploadApi } from '../services/uploadApi.js';
import { adaptBanner } from '../utils/adapters.js';

export const BannersView = () => {
  const [banners, setBanners] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterPos, setFilterPos] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [inspectingBanner, setInspectingBanner] = useState(null);
  
  // Submission & Alert state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State (used for both create and edit)
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [position, setPosition] = useState('HOME_HERO');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fileInputRef = useRef(null);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filterPos !== 'ALL') params.position = filterPos;
      if (filterStatus === 'ACTIVE') params.isActive = 'true';
      if (filterStatus === 'INACTIVE') params.isActive = 'false';
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const [res, statsRes] = await Promise.allSettled([
        bannersApi.getBanners(params),
        bannersApi.getStats(),
      ]);

      if (res.status === 'fulfilled') {
        const raw = Array.isArray(res.value?.data) ? res.value.data : res.value?.data?.banners || [];
        setBanners(raw.map(adaptBanner).filter(Boolean));
      }

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value?.data || null);
      }
    } catch (err) {
      console.error('Failed to load banners:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [filterPos, filterStatus]);

  // Open Create Modal
  const openCreateModal = () => {
    setTitle('');
    setSubtitle('');
    setImageUrl('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80');
    setTargetUrl('https://countrydrive.com/search');
    setPosition('HOME_HERO');
    setSortOrder(0);
    setIsActive(true);
    setStartDate('');
    setEndDate('');
    setEditingBanner(null);
    setErrorMsg('');
    setShowCreateModal(true);
  };

  // Open Edit Modal
  const openEditModal = (b) => {
    setEditingBanner(b);
    setTitle(b.title || '');
    setSubtitle(b.subtitle || '');
    setImageUrl(b.imageUrl || '');
    setTargetUrl(b.targetUrl || '');
    setPosition(b.position || 'HOME_HERO');
    setSortOrder(b.sortOrder ?? 0);
    setIsActive(b.isActive ?? true);
    setStartDate(b.startDate ? new Date(b.startDate).toISOString().slice(0, 16) : '');
    setEndDate(b.endDate ? new Date(b.endDate).toISOString().slice(0, 16) : '');
    setErrorMsg('');
    setShowCreateModal(true);
  };

  // Upload Image File Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg('');
    try {
      const result = await uploadApi.uploadFile(file, { category: 'VEHICLE_PHOTO' });
      if (result?.fileUrl) {
        setImageUrl(result.fileUrl);
        setSuccessMsg('Banner image uploaded successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        throw new Error('Image URL not returned by storage service');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Image upload failed. You can also paste an image URL directly.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Helper to normalize target URL so backend z.string().url() never rejects relative paths
  const normalizeUrl = (urlStr) => {
    if (!urlStr || !urlStr.trim()) return undefined;
    const trimmed = urlStr.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    if (trimmed.startsWith('/')) {
      return `https://countrydrive.com${trimmed}`;
    }
    return `https://${trimmed}`;
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Banner title is required.');
      return;
    }
    if (!imageUrl.trim()) {
      setErrorMsg('Banner image URL is required. Please paste a URL or upload a file.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const normalizedTarget = normalizeUrl(targetUrl);

      // Safe date parsing
      let isoStartDate = undefined;
      let isoEndDate = undefined;
      if (startDate) {
        const d = new Date(startDate);
        if (isNaN(d.getTime())) throw new Error('Invalid Start Date format.');
        isoStartDate = d.toISOString();
      }
      if (endDate) {
        const d = new Date(endDate);
        if (isNaN(d.getTime())) throw new Error('Invalid Expiry Date format.');
        isoEndDate = d.toISOString();
      }

      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        imageUrl: imageUrl.trim(),
        targetUrl: normalizedTarget,
        position,
        sortOrder: Number(sortOrder) || 0,
        isActive,
        startDate: isoStartDate,
        endDate: isoEndDate,
      };

      if (editingBanner) {
        await bannersApi.update(editingBanner.id, payload);
        setSuccessMsg('Banner updated successfully!');
      } else {
        await bannersApi.create(payload);
        setSuccessMsg('Banner created and published successfully!');
      }

      setShowCreateModal(false);
      setEditingBanner(null);
      fetchBanners();
    } catch (err) {
      console.error('Save banner error:', err);
      setErrorMsg(err.message || 'Failed to save banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id, currentActive) => {
    try {
      await bannersApi.update(id, { isActive: !currentActive });
      setBanners((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isActive: !currentActive } : b))
      );
      setSuccessMsg(`Banner ${!currentActive ? 'activated' : 'paused'} successfully.`);
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error('Toggle banner error:', err);
      setErrorMsg(err.message || 'Failed to toggle banner status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this marketing banner? This action cannot be undone.')) return;
    try {
      await bannersApi.delete(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      if (inspectingBanner?.id === id) setInspectingBanner(null);
      setSuccessMsg('Banner deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error('Delete banner error:', err);
      alert(err.message || 'Failed to delete banner');
    }
  };

  const positions = ['ALL', 'HOME_HERO', 'HOME_CAROUSEL', 'SEARCH_PAGE', 'OFFERS_PAGE', 'POPUP'];

  const getPositionBadge = (pos) => {
    switch (pos) {
      case 'HOME_HERO':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'HOME_CAROUSEL':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'SEARCH_PAGE':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'OFFERS_PAGE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'POPUP':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
            <Layers className="text-[#00D26A]" size={24} />
            <span>Marketing Banners & Hero Carousels</span>
          </h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Full backend schema parity: multi-slot placements, priority ordering, deep linking, scheduling & media upload.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchBanners}
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
            <span>Create Banner</span>
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

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Total Banners</span>
          <span className="text-xl font-bold text-white mt-1 block">
            {stats?.total ?? banners.length}
          </span>
          <span className="text-[10px] text-[#8ba398]">Configured Slots</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Active on App</span>
          <span className="text-xl font-bold text-[#00D26A] mt-1 block">
            {stats?.active ?? banners.filter((b) => b.isActive).length}
          </span>
          <span className="text-[10px] text-emerald-400">Serving Live Traffic</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Inactive / Paused</span>
          <span className="text-xl font-bold text-zinc-400 mt-1 block">
            {stats?.inactive ?? banners.filter((b) => !b.isActive).length}
          </span>
          <span className="text-[10px] text-[#8ba398]">Draft / Suspended</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Hero & Carousels</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">
            {banners.filter((b) => ['HOME_HERO', 'HOME_CAROUSEL'].includes(b.position)).length}
          </span>
          <span className="text-[10px] text-[#8ba398]">Homepage Prime Slots</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#121e19] p-3 rounded-2xl border border-[#1c3229]">
        {/* Placement Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {positions.map((p) => (
            <button
              key={p}
              onClick={() => setFilterPos(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterPos === p
                  ? 'bg-[#00D26A] text-black font-bold'
                  : 'text-[#8ba398] hover:text-white bg-[#0e1713] border border-[#1c3229]'
              }`}
            >
              {p === 'ALL' ? 'All Placements' : p.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Status Filter & Search */}
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0e1713] border border-[#1c3229] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D26A]"
          >
            <option value="ALL">Status: All</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Paused Only</option>
          </select>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchBanners();
            }}
            className="relative flex-1 sm:w-60"
          >
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#577064]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search banners..."
              className="w-full bg-[#0e1713] border border-[#1c3229] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#577064] focus:outline-none focus:border-[#00D26A]"
            />
          </form>
        </div>
      </div>

      {/* Grid of Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length > 0 ? (
          banners.map((b) => (
            <div
              key={b.id}
              onClick={() => setInspectingBanner(b)}
              className="bg-[#121e19] border border-[#1c3229] rounded-2xl overflow-hidden shadow-xl hover:border-[#00D26A]/60 hover:bg-[#14231d] cursor-pointer transition-all duration-200 flex flex-col justify-between group select-none"
              title="Click anywhere to inspect banner details & placement"
            >
              <div>
                {/* Banner Image Preview Container */}
                <div className="relative h-44 overflow-hidden bg-black/50">
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';
                    }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1713] via-transparent to-black/30 pointer-events-none" />

                  {/* Position Pill */}
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md ${getPositionBadge(b.position)}`}>
                    {b.position}
                  </div>

                  {/* Sort Order Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-[10px] font-mono text-[#00D26A] font-bold">
                      #{b.sortOrder}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.isActive
                          ? 'bg-emerald-500/80 text-black'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {b.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>
                </div>

                {/* Banner Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-[#00D26A] transition-colors">
                      {b.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#8ba398] line-clamp-2">
                    {b.subtitle || 'No subtitle specified.'}
                  </p>

                  {/* Destination URL */}
                  {b.targetUrl && (
                    <div className="text-[11px] text-[#00D26A] font-mono pt-1 truncate flex items-center gap-1.5">
                      <Link2 size={12} className="shrink-0" />
                      <a
                        href={b.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {b.targetUrl}
                      </a>
                    </div>
                  )}

                  {/* Schedule dates if present */}
                  {(b.startDate || b.endDate) && (
                    <div className="flex items-center gap-2 text-[10px] text-[#577064] pt-1">
                      <Calendar size={11} />
                      <span>
                        {b.startDate ? new Date(b.startDate).toLocaleDateString() : 'Now'}
                        {' → '}
                        {b.endDate ? new Date(b.endDate).toLocaleDateString() : 'Indefinite'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 pt-3 border-t border-[#1c3229] flex items-center justify-between text-xs bg-[#0e1713]/50">
                <button
                  onClick={() => setInspectingBanner(b)}
                  className="px-2.5 py-1 text-xs text-[#8ba398] group-hover:text-[#00D26A] flex items-center gap-1 hover:bg-[#1c3229] rounded-lg transition-colors font-semibold"
                >
                  <Eye size={13} />
                  <span>Inspect</span>
                </button>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(b);
                    }}
                    className="p-1.5 text-[#8ba398] hover:text-white hover:bg-[#1c3229] rounded-lg transition-colors"
                    title="Edit Banner"
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(b.id, b.isActive);
                    }}
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
                      b.isActive ? 'text-[#00D26A] hover:bg-emerald-500/10' : 'text-zinc-500 hover:bg-zinc-800'
                    }`}
                  >
                    {b.isActive ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
                    <span>{b.isActive ? 'Live' : 'Paused'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(b.id);
                    }}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-[#8ba398] bg-[#121e19] rounded-2xl border border-[#1c3229] space-y-3">
            <ImageIcon size={36} className="mx-auto text-[#577064]" />
            <p className="text-sm font-semibold text-white">No promotional banners found</p>
            <p className="text-xs text-[#8ba398]">No banners match your active filter criteria. Click below to add one.</p>
            <button
              onClick={openCreateModal}
              className="btn-glossy btn-glossy-emerald px-4 py-2 text-xs rounded-xl font-bold text-black inline-flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Create New Banner</span>
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Banner Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1c3229] pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-[#00D26A]" />
                  <span>{editingBanner ? 'Edit Marketing Banner' : 'Create New Marketing Banner'}</span>
                </h3>
                <p className="text-xs text-[#8ba398]">
                  Configure placement, scheduling, priority order & deep links
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingBanner(null);
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

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              {/* Title & Subtitle */}
              <div>
                <label className="block text-[#8ba398] font-semibold mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Drive Premium Fortuners this Weekend"
                  className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                />
              </div>

              <div>
                <label className="block text-[#8ba398] font-semibold mb-1">Subtitle / Marketing Hook</label>
                <input
                  type="text"
                  maxLength={255}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Starting from ₹4,500/day with zero security deposit"
                  className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                />
              </div>

              {/* Image URL & Upload button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#8ba398] font-semibold">Banner Image *</label>
                  <label className="text-[11px] text-[#00D26A] hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                    <Upload size={12} />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-[#00D26A]"
                />
                {isUploading && (
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#00D26A]">
                    <Loader2 size={12} className="animate-spin" />
                    <span>Uploading image to server storage...</span>
                  </div>
                )}
                {/* Live Preview of Image */}
                {imageUrl && (
                  <div className="mt-2 relative h-28 rounded-xl overflow-hidden border border-[#1c3229] bg-black/40">
                    <img
                      src={imageUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Target Deep Link */}
              <div>
                <label className="block text-[#8ba398] font-semibold mb-1">
                  Destination / Target URL
                </label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://countrydrive.com/vehicles/suv or /search?category=SUV"
                  className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                />
                <p className="text-[10px] text-[#577064] mt-1">
                  Full URLs (https://...) or in-app paths (/search?category=SUV) will be auto-formatted.
                </p>
              </div>

              {/* Placement Position & Sort Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Placement Position *</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                  >
                    <option value="HOME_HERO">HOME_HERO (Top Hero Slider)</option>
                    <option value="HOME_CAROUSEL">HOME_CAROUSEL (Middle Carousel)</option>
                    <option value="SEARCH_PAGE">SEARCH_PAGE (Top of Fleet)</option>
                    <option value="OFFERS_PAGE">OFFERS_PAGE (Deals Page Banner)</option>
                    <option value="POPUP">POPUP (Modal Announcement)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Sort Priority Order</label>
                  <input
                    type="number"
                    min={0}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00D26A]"
                  />
                  <span className="text-[10px] text-[#577064]">Higher number appears first</span>
                </div>
              </div>

              {/* Scheduling Start & End Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Start Date & Time (Optional)</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Expiry Date & Time (Optional)</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="bannerIsActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-[#00D26A] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="bannerIsActive" className="text-white cursor-pointer select-none">
                  Make this banner actively visible immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#1c3229]">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingBanner(null);
                  }}
                  className="px-4 py-2 text-xs text-[#8ba398] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="btn-glossy btn-glossy-emerald px-6 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{editingBanner ? 'Update Banner' : 'Publish Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Banner Modal */}
      {inspectingBanner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1c3229] pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Banner Inspection & Analytics</h3>
                <p className="text-xs text-[#8ba398]">Technical parameters & campaign delivery status</p>
              </div>
              <button onClick={() => setInspectingBanner(null)} className="text-[#8ba398] hover:text-white">✕</button>
            </div>

            {/* Large Preview */}
            <div className="relative h-56 rounded-2xl overflow-hidden border border-[#1c3229] bg-black/60">
              <img
                src={inspectingBanner.imageUrl}
                alt={inspectingBanner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold uppercase ${getPositionBadge(inspectingBanner.position)}`}>
                  {inspectingBanner.position}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${inspectingBanner.isActive ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                  {inspectingBanner.isActive ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-bold text-white">{inspectingBanner.title}</h4>
                <p className="text-xs text-[#8ba398] mt-1">{inspectingBanner.subtitle || 'No subtitle specified.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#121e19] border border-[#1c3229] rounded-xl text-xs">
                <div>
                  <span className="text-[#577064] block text-[10px] uppercase font-bold">Banner ID</span>
                  <span className="font-mono text-white text-[11px] select-all">{inspectingBanner.id}</span>
                </div>
                <div>
                  <span className="text-[#577064] block text-[10px] uppercase font-bold">Sort Priority Order</span>
                  <span className="font-mono text-[#00D26A] font-bold">#{inspectingBanner.sortOrder}</span>
                </div>
                <div>
                  <span className="text-[#577064] block text-[10px] uppercase font-bold">Scheduled From</span>
                  <span className="text-white">
                    {inspectingBanner.startDate ? new Date(inspectingBanner.startDate).toLocaleString() : 'Immediate'}
                  </span>
                </div>
                <div>
                  <span className="text-[#577064] block text-[10px] uppercase font-bold">Scheduled Until</span>
                  <span className="text-white">
                    {inspectingBanner.endDate ? new Date(inspectingBanner.endDate).toLocaleString() : 'Indefinite / Permanent'}
                  </span>
                </div>
              </div>

              {inspectingBanner.targetUrl && (
                <div className="p-3 bg-[#121e19] border border-[#1c3229] rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[#577064] block text-[10px] uppercase font-bold">Destination URL</span>
                    <span className="font-mono text-[#00D26A] text-[11px] truncate block max-w-sm">
                      {inspectingBanner.targetUrl}
                    </span>
                  </div>
                  <a
                    href={inspectingBanner.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-[#1c3229] hover:bg-[#00D26A] hover:text-black rounded-lg text-white transition-colors"
                    title="Open Target Link"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#1c3229]">
              <button
                onClick={() => handleDelete(inspectingBanner.id)}
                className="px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const b = inspectingBanner;
                    setInspectingBanner(null);
                    openEditModal(b);
                  }}
                  className="px-4 py-1.5 bg-[#1c3229] hover:bg-[#254236] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Edit2 size={13} />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => setInspectingBanner(null)}
                  className="btn-glossy btn-glossy-emerald px-5 py-1.5 text-xs rounded-xl font-bold text-black"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
