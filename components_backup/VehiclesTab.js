'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  RefreshCw,
  Car,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  FileText,
  AlertCircle,
  RotateCcw,
  X,
  ShieldCheck,
  CheckCircle,
  Eye,
  Clock,
  AlertTriangle,
  Upload,
  Edit3,
  Save,
  DollarSign
} from 'lucide-react';

/* Inner Edit Vehicle Modal Component */
function EditVehicleModal({ vehicle, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: vehicle.id,
    name: vehicle.name || '',
    regNumber: vehicle.regNumber || '',
    category: vehicle.category || 'SUV',
    fuelType: vehicle.fuelType || 'Petrol',
    transmission: vehicle.transmission || 'Manual',
    ratePerHour: vehicle.ratePerHour || 150,
    perKmRate: vehicle.perKmRate || 12,
    extraKmRate: vehicle.extraKmRate || 15,
    minDuration: vehicle.minDuration || 4,
    deposit: vehicle.deposit || 2000,
    status: vehicle.status || 'ACTIVE'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              Edit Vehicle Specs & Pricing Rules
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b pb-1">
              <Car className="h-4 w-4 text-indigo-600" /> Vehicle Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Vehicle Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Registration Number *</label>
                <input
                  type="text"
                  required
                  value={formData.regNumber}
                  onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 font-mono text-gray-900 font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Fuel Type</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-800"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric (EV)">Electric (EV)</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-800"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b pb-1">
              <DollarSign className="h-4 w-4 text-emerald-600" /> Pricing Model & Rates
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Hourly Rate (₹/hr)</label>
                <input
                  type="number"
                  value={formData.ratePerHour}
                  onChange={(e) => setFormData({ ...formData, ratePerHour: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg p-2 font-mono text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Per KM Rate (₹/KM)</label>
                <input
                  type="number"
                  value={formData.perKmRate}
                  onChange={(e) => setFormData({ ...formData, perKmRate: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg p-2 font-mono text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Extra KM Overage (₹)</label>
                <input
                  type="number"
                  value={formData.extraKmRate}
                  onChange={(e) => setFormData({ ...formData, extraKmRate: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg p-2 font-mono text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg p-2 font-mono text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-sm"
            >
              <Save className="h-4 w-4" /> Save Vehicle Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VehiclesTab({
  vehicles = [],
  onToggleStatus,
  onOpenAddModal,
  onResubmitVehicle,
  onUpdateVehicle,
  onUpdateDocument,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Gallery Modal States
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit Modal State
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Dedicated Documents Management Modal States
  const [selectedVehicleDocs, setSelectedVehicleDocs] = useState(null);
  const [activeDocPreview, setActiveDocPreview] = useState(null);

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString('en-IN');

  const filteredVehicles = useMemo(() => {
    const list = Array.isArray(vehicles) ? vehicles : [];
    return list.filter((v) => {
      const matchesSearch =
        (v.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.regNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const openVehicleGallery = (vehicle, initialIndex = 0) => {
    const photos = [
      { label: 'Front Photo', src: vehicle.frontPhoto || vehicle.image },
      { label: 'Rear Photo', src: vehicle.rearPhoto },
      { label: 'Left Side', src: vehicle.leftPhoto },
      { label: 'Right Side', src: vehicle.rightPhoto },
      { label: 'Interior', src: vehicle.interiorPhoto },
      { label: 'Dashboard', src: vehicle.dashboardPhoto },
    ].filter((p) => p.src);

    if (photos.length > 0) {
      setGalleryPhotos(photos);
      setCurrentIndex(initialIndex);
      setIsModalOpen(true);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % galleryPhotos.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  return (
    <div className="w-full space-y-5">
      {/* Header & Add Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-950">
            Vehicle Fleet & Document Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage vehicles, verification states, pricing rules, and compliance.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add New Vehicle
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or reg no..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-gray-400 shrink-0 hidden sm:block" />
          {['ALL', 'ACTIVE', 'MAINTENANCE', 'PENDING_VERIFICATION', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      {paginatedVehicles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
          <Car className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-3 text-base font-semibold text-gray-900">
            No vehicles found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search filters or add a new vehicle.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedVehicles.map((vehicle) => (
            <article
              key={vehicle.id}
              className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              {/* Primary Vehicle Image & Status Badge */}
              <div
                className="relative h-44 bg-gray-100 cursor-pointer"
                onClick={() => openVehicleGallery(vehicle, 0)}
              >
                {vehicle.image || vehicle.frontPhoto ? (
                  <img
                    src={vehicle.image || vehicle.frontPhoto}
                    alt={vehicle.name || 'Vehicle'}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Car className="h-12 w-12 text-gray-300" />
                  </div>
                )}

                <span
                  className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm ${
                    vehicle.status === 'ACTIVE'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : vehicle.status === 'MAINTENANCE'
                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                      : vehicle.status === 'REJECTED'
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : 'border-blue-200 bg-blue-50 text-blue-700'
                  }`}
                >
                  {vehicle.status || 'PENDING'}
                </span>
              </div>

              {/* Rejection Reason Banner */}
              {vehicle.status === 'REJECTED' && vehicle.rejectionReason && (
                <div className="bg-rose-50 border-b border-rose-100 p-2.5 flex items-start gap-2 text-xs text-rose-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <p><span className="font-bold">Rejected:</span> {vehicle.rejectionReason}</p>
                </div>
              )}

              {/* Multi-Photo Thumbnails & Document Status Trigger */}
              <div
                className="px-4 pt-3 cursor-pointer"
                onClick={() => openVehicleGallery(vehicle, 0)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1 hover:text-indigo-600 transition">
                    <ImageIcon className="h-3 w-3" /> Evidence & Documents
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVehicleDocs(vehicle);
                    }}
                    className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded"
                  >
                    <FileText className="h-3 w-3" /> Manage Docs
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1" onClick={(e) => e.stopPropagation()}>
                  {[
                    { label: 'Front', src: vehicle.frontPhoto || vehicle.image, index: 0 },
                    { label: 'Rear', src: vehicle.rearPhoto, index: 1 },
                    { label: 'Left', src: vehicle.leftPhoto, index: 2 },
                    { label: 'Right', src: vehicle.rightPhoto, index: 3 },
                    { label: 'Interior', src: vehicle.interiorPhoto, index: 4 },
                    { label: 'Dashboard', src: vehicle.dashboardPhoto, index: 5 },
                  ]
                    .filter((p) => p.src)
                    .map((photo) => (
                      <button
                        key={photo.label}
                        type="button"
                        onClick={() => openVehicleGallery(vehicle, photo.index)}
                        className="relative h-10 w-12 flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50 hover:opacity-80"
                      >
                        <img src={photo.src} alt={photo.label} className="h-full w-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center font-medium">
                          {photo.label}
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Vehicle Details & Financial Stats */}
              <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                <div>
                  <h3 className="break-words font-bold text-gray-900">
                    {vehicle.name || 'Unnamed Vehicle'}
                  </h3>

                  <p className="mt-1 break-all font-mono text-xs text-gray-500">
                    {vehicle.regNumber || 'Registration unavailable'}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="min-w-0 rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <span className="block text-gray-500">Rate / Hour</span>
                      <span className="mt-1 block break-words font-semibold text-gray-900">
                        ₹{formatCurrency(vehicle.ratePerHour)}/hr
                      </span>
                    </div>

                    <div className="min-w-0 rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <span className="block text-gray-500">Total Earnings</span>
                      <span className="mt-1 block break-words font-semibold text-emerald-600">
                        ₹{formatCurrency(vehicle.totalEarned)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions: Edit Vehicle & Status Actions */}
                <div className="flex items-center justify-between gap-2 border-t border-gray-200 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingVehicle(vehicle)}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
                    Edit Vehicle
                  </button>

                  {vehicle.status === 'REJECTED' ? (
                    <button
                      type="button"
                      onClick={() => onResubmitVehicle?.(vehicle)}
                      className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
                    >
                      <RotateCcw className="h-3 w-3" /> Resubmit
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(vehicle.id)}
                      className="inline-flex items-center gap-1.5 rounded-md py-1.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      {vehicle.status === 'ACTIVE' ? 'Set Maintenance' : 'Activate'}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <EditVehicleModal
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSave={(updatedData) => {
            if (onUpdateVehicle) {
              onUpdateVehicle(updatedData);
            }
            setEditingVehicle(null);
          }}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 rounded-xl shadow-sm">
          <p className="text-xs text-gray-500">
            Showing page <span className="font-semibold text-gray-800">{currentPage}</span> of <span className="font-semibold text-gray-800">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Photo Gallery Modal */}
      {isModalOpen && galleryPhotos.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-xl p-4 overflow-hidden shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                {galleryPhotos[currentIndex]?.label} ({currentIndex + 1} of {galleryPhotos.length})
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-900 text-white rounded-full px-3 py-1 text-xs font-bold hover:bg-black"
              >
                ✕ Close
              </button>
            </div>

            <div className="relative w-full flex items-center justify-center bg-black rounded-lg overflow-hidden h-[60vh]">
              <img
                src={galleryPhotos[currentIndex]?.src}
                alt="Vehicle view"
                className="max-h-full max-w-full object-contain"
              />

              {galleryPhotos.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-3 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {galleryPhotos.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-3 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Vehicle Documents & Verification Management Modal */}
      {selectedVehicleDocs && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedVehicleDocs(null)}
        >
          <div
            className="relative max-w-xl w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Vehicle Documents & Compliance Status</h3>
                <p className="text-xs text-gray-500">{selectedVehicleDocs.name} ({selectedVehicleDocs.regNumber})</p>
              </div>
              <button
                onClick={() => setSelectedVehicleDocs(null)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>Vendors can submit or update documents for correction, but final approval is handled by platform admins.</span>
            </div>

            <div className="space-y-3">
              {/* RC Document */}
              <div className="flex items-center justify-between p-3 rounded-xl border bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Registration Certificate (RC)</p>
                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Status: APPROVED (Valid)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveDocPreview({
                      title: 'Registration Certificate (RC)',
                      src: selectedVehicleDocs.rcPhoto || selectedVehicleDocs.image || selectedVehicleDocs.frontPhoto
                    })}
                    className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-700"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Please use the resubmit workflow for document corrections.')}
                    className="flex items-center gap-1 text-xs bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-lg font-medium hover:bg-gray-300"
                  >
                    <Upload className="h-3.5 w-3.5" /> Re-upload
                  </button>
                </div>
              </div>

              {/* Insurance Document */}
              <div className="flex items-center justify-between p-3 rounded-xl border bg-gray-50">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Insurance Policy</p>
                    <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Status: PENDING_VERIFICATION
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveDocPreview({
                      title: 'Insurance Policy',
                      src: selectedVehicleDocs.insurancePhoto || selectedVehicleDocs.image || selectedVehicleDocs.frontPhoto
                    })}
                    className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-700"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Document update requested.')}
                    className="flex items-center gap-1 text-xs bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-lg font-medium hover:bg-gray-300"
                  >
                    <Upload className="h-3.5 w-3.5" /> Re-upload
                  </button>
                </div>
              </div>

              {/* PUC Document */}
              <div className="flex items-center justify-between p-3 rounded-xl border bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">PUC Certificate</p>
                    <p className="text-[10px] text-gray-500">Optional / Expiring Soon</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDocPreview({
                    title: 'PUC Certificate',
                    src: selectedVehicleDocs.pucPhoto || selectedVehicleDocs.image || selectedVehicleDocs.frontPhoto
                  })}
                  className="flex items-center gap-1 text-xs bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-medium hover:bg-slate-300"
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedVehicleDocs(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-black"
              >
                Close Documents Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Image Preview Overlay */}
      {activeDocPreview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveDocPreview(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-xl p-4 overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-gray-900">{activeDocPreview.title}</h4>
              <button
                onClick={() => setActiveDocPreview(null)}
                className="bg-gray-900 text-white rounded-full px-3 py-1 text-xs font-bold hover:bg-black"
              >
                ✕ Close Preview
              </button>
            </div>
            <div className="w-full h-[65vh] bg-gray-100 rounded-lg flex items-center justify-center p-2 overflow-hidden">
              <img
                src={activeDocPreview.src}
                alt={activeDocPreview.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}