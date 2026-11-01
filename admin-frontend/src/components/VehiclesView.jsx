import React, { useState, useEffect } from 'react';
import {
  Car,
  Bike,
  Zap,
  Truck,
  Plus,
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Star,
  MapPin,
  CheckCircle,
  AlertCircle,
  Wrench,
  Trash2,
  RefreshCw,
  Fuel,
  Gauge,
  Eye,
  ShieldCheck,
  BatteryCharging,
  SlidersHorizontal,
} from 'lucide-react';
import { vehiclesApi } from '../services/vehiclesApi.js';
import { adaptVehicle } from '../utils/adapters.js';
import { VehicleDetailsModal } from './VehicleDetailsModal.jsx';

export const VehiclesView = ({
  vehicles: initialVehicles,
  onOpenAddVehicle,
  openAddVehicleModal,
  onDeleteVehicle,
  searchQuery = '',
}) => {
  const [vehicles, setVehicles] = useState([]);
  const [pendingVehicles, setPendingVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending'
  const [isLoading, setIsLoading] = useState(!initialVehicles);
  const [search, setSearch] = useState(searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedVerification, setSelectedVerification] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const [res, pendingRes] = await Promise.allSettled([
        vehiclesApi.getVehicles(),
        vehiclesApi.listPending(),
      ]);

      if (res.status === 'fulfilled') {
        const raw = Array.isArray(res.value?.data) ? res.value.data : res.value?.data?.vehicles || [];
        setVehicles(raw.map(adaptVehicle).filter(Boolean));
      }

      if (pendingRes.status === 'fulfilled') {
        const rawPending = Array.isArray(pendingRes.value?.data)
          ? pendingRes.value.data
          : pendingRes.value?.data?.vehicles || [];
        setPendingVehicles(rawPending.map(adaptVehicle).filter(Boolean));
      }
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialVehicles && initialVehicles.length > 0) {
      setVehicles(initialVehicles);
    } else {
      loadVehicles();
    }
  }, [initialVehicles]);

  const activeList = activeTab === 'pending' ? pendingVehicles : vehicles;

  const filteredVehicles = activeList.filter((v) => {
    const regNo = v.registrationNo || v.registrationNumber || '';
    const loc = v.location || v.city || '';
    const name = v.name || `${v.make || ''} ${v.model || ''}`;
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      regNo.toLowerCase().includes(search.toLowerCase()) ||
      loc.toLowerCase().includes(search.toLowerCase());

    const cat = (v.category || '').toUpperCase();
    const matchesCategory =
      selectedCategory === 'All' ||
      cat === selectedCategory.toUpperCase() ||
      (selectedCategory === 'Car' && ['SEDAN', 'HATCHBACK', 'SUV', 'LUXURY'].includes(cat)) ||
      (selectedCategory === 'Bike' && cat === 'MOTORBIKE') ||
      (selectedCategory === 'Scooty' && cat === 'SCOOTY');

    const fuel = (v.fuelType || '').toUpperCase();
    const matchesFuel =
      selectedFuel === 'All' ||
      fuel === selectedFuel.toUpperCase();

    const st = (v.status || '').toUpperCase();
    const matchesStatus =
      selectedStatus === 'All' ||
      st === selectedStatus.toUpperCase() ||
      (selectedStatus === 'Available' && st === 'AVAILABLE') ||
      (selectedStatus === 'Rented' && ['BOOKED', 'ACTIVE_RENTAL'].includes(st)) ||
      (selectedStatus === 'Maintenance' && st === 'MAINTENANCE');

    const ver = (v.verificationStatus || '').toUpperCase();
    const matchesVerification =
      selectedVerification === 'All' ||
      ver === selectedVerification.toUpperCase();

    return matchesSearch && matchesCategory && matchesFuel && matchesStatus && matchesVerification;
  });

  const categories = ['All', 'SUV', 'Sedan', 'Hatchback', 'Luxury', 'Bike', 'Scooty', 'Other'];
  const fuels = ['All', 'Petrol', 'Diesel', 'EV', 'Hybrid', 'CNG'];
  const statuses = ['All', 'Available', 'Rented', 'Maintenance', 'Suspended'];
  const verifications = ['All', 'Verified', 'Pending', 'In_Review', 'Rejected'];

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate or remove this vehicle?')) return;
    try {
      await vehiclesApi.deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setPendingVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error('Failed to remove vehicle:', err);
      alert(err.message || 'Failed to remove vehicle');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const isAvail = String(currentStatus || '').toUpperCase() === 'AVAILABLE';
    const nextStatus = isAvail ? 'MAINTENANCE' : 'AVAILABLE';
    try {
      await vehiclesApi.updateStatus(id, {
        status: nextStatus,
        reason: `Admin toggled to ${nextStatus}`,
      });
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: nextStatus } : v))
      );
    } catch (err) {
      console.error('Failed to update vehicle status:', err);
      alert(err.message || 'Failed to update vehicle status');
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'AVAILABLE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-[#00D26A] border border-[#00D26A]/30">
          <CheckCircle size={11} />
          Available
        </span>
      );
    }
    if (['RENTED', 'BOOKED', 'ACTIVE_RENTAL'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
          <AlertCircle size={11} />
          Rented
        </span>
      );
    }
    if (s === 'MAINTENANCE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <Wrench size={11} />
          Maintenance
        </span>
      );
    }
    if (['DRAFT', 'PENDING', 'PENDING_VERIFICATION'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
          <AlertCircle size={11} />
          Verification
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-500/15 text-zinc-400 border border-zinc-500/30">
        {status}
      </span>
    );
  };

  // KPIs
  const totalCount = vehicles.length;
  const availableCount = vehicles.filter((v) => (v.status || '').toUpperCase() === 'AVAILABLE').length;
  const inRentalCount = vehicles.filter((v) => ['BOOKED', 'ACTIVE_RENTAL'].includes((v.status || '').toUpperCase())).length;
  const maintenanceCount = vehicles.filter((v) => (v.status || '').toUpperCase() === 'MAINTENANCE').length;
  const pendingCount = pendingVehicles.length;

  return (
    <div className="space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Vehicle Fleet Inventory
          </h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Full Prisma spec parity: telemetry, regulatory compliance, daily/hourly rates, and verification queue.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadVehicles}
            className="px-3.5 py-2.5 rounded-xl bg-[#121e19] hover:bg-[#172721] border border-[#1c3229] text-xs font-semibold text-[#8ba398] hover:text-white flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#00D26A]' : ''} />
            <span>Sync Fleet</span>
          </button>
          <button
            onClick={onOpenAddVehicle || openAddVehicleModal}
            className="btn-glossy btn-glossy-emerald px-4 py-2.5 text-xs rounded-xl flex items-center gap-1.5 font-bold text-black"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Total Fleet</span>
          <span className="text-xl font-bold text-white mt-1 block">{totalCount}</span>
          <span className="text-[10px] text-[#8ba398]">All Listed Vehicles</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Available on Road</span>
          <span className="text-xl font-bold text-[#00D26A] mt-1 block">{availableCount}</span>
          <span className="text-[10px] text-[#00D26A]">Ready for Booking</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">In Active Rental</span>
          <span className="text-xl font-bold text-sky-400 mt-1 block">{inRentalCount}</span>
          <span className="text-[10px] text-sky-400">On Road Trips</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">In Service / Maint.</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">{maintenanceCount}</span>
          <span className="text-[10px] text-amber-400">Depot Inspection</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl col-span-2 sm:col-span-1">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Pending Verification</span>
          <span className="text-xl font-bold text-yellow-400 mt-1 block">{pendingCount}</span>
          <span className="text-[10px] text-yellow-400">RTO / Compliance</span>
        </div>
      </div>

      {/* Tabs: Active Fleet vs Verification Queue */}
      <div className="flex border-b border-[#1c3229] gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2.5 border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-[#00D26A] text-[#00D26A]'
              : 'border-transparent text-[#8ba398] hover:text-white'
          }`}
        >
          All Fleet Vehicles ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'border-[#00D26A] text-[#00D26A]'
              : 'border-transparent text-[#8ba398] hover:text-white'
          }`}
        >
          <span>Pending Verification Queue</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Bar with All Backend Options */}
      <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3 top-3 text-[#577064]" />
            <input
              type="text"
              placeholder="Search make, model, reg #, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a110e] border border-[#1c3229] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#577064] focus:outline-none focus:border-[#00D26A]"
            />
          </div>

          {/* Quick Selects */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="bg-[#0a110e] border border-[#1c3229] text-xs text-white rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#00D26A]"
            >
              {fuels.map((f) => (
                <option key={f} value={f}>
                  Fuel: {f}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#0a110e] border border-[#1c3229] text-xs text-white rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#00D26A]"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>

            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              className="bg-[#0a110e] border border-[#1c3229] text-xs text-white rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#00D26A]"
            >
              {verifications.map((v) => (
                <option key={v} value={v}>
                  Verify: {v}
                </option>
              ))}
            </select>

            {/* Layout Toggle */}
            <div className="flex items-center bg-[#0a110e] p-1 rounded-xl border border-[#1c3229] ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#00D26A] text-black' : 'text-[#8ba398]'
                }`}
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-[#00D26A] text-black' : 'text-[#8ba398]'
                }`}
              >
                <ListIcon size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#00D26A] text-black font-bold'
                  : 'bg-[#0a110e] text-[#8ba398] hover:text-white border border-[#1c3229]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle)}
              className="bg-[#121e19] border border-[#1c3229] rounded-2xl overflow-hidden hover:border-[#00D26A]/60 hover:bg-[#14231d] cursor-pointer transition-all duration-300 group flex flex-col justify-between shadow-md select-none"
              title="Click anywhere to inspect vehicle specs, telemetry & compliance"
            >
              <div>
                {/* Vehicle Image Header */}
                <div
                  className="relative h-44 overflow-hidden bg-[#0a110e]"
                >
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(vehicle.status)}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] text-amber-400 font-bold flex items-center gap-1">
                    <Star size={12} className="fill-amber-400" />
                    <span>{vehicle.rating}</span>
                  </div>

                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                    <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-mono font-bold">
                      {vehicle.fuelType}
                    </span>
                    <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-[#00D26A] font-bold">
                      {vehicle.transmission}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <h3 className="font-semibold text-white text-base leading-snug hover:text-[#00D26A] transition-colors">
                        {vehicle.name}
                      </h3>
                      <p className="text-[11px] font-mono text-[#8ba398]">
                        {vehicle.registrationNo || vehicle.registrationNumber}
                      </p>
                    </div>
                    <span className="bg-[#172721] text-[#00D26A] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#1c3229]">
                      {vehicle.category}
                    </span>
                  </div>

                  {/* Telemetry info */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8ba398] bg-[#0a110e] p-2 rounded-xl border border-[#1c3229]/60">
                    <div className="flex items-center gap-1">
                      <Gauge size={12} className="text-[#00D26A]" />
                      <span>{Number(vehicle.odometerReading || 0).toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel size={12} className="text-amber-400" />
                      <span>
                        {vehicle.batteryLevel !== null && vehicle.batteryLevel !== undefined
                          ? `${vehicle.batteryLevel}% EV`
                          : vehicle.fuelLevel !== null && vehicle.fuelLevel !== undefined
                          ? `${vehicle.fuelLevel}% Fuel`
                          : 'Full'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#8ba398]">
                    <div className="flex items-center gap-1 truncate max-w-[170px]">
                      <MapPin size={13} className="text-[#00D26A] shrink-0" />
                      <span className="truncate">{vehicle.location || vehicle.city}</span>
                    </div>
                    <span>{vehicle.trips} Trips</span>
                  </div>

                  {/* Pricing row */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#1c3229]">
                    <div>
                      <span className="text-base font-bold text-white">
                        ₹{vehicle.pricePerDay}
                      </span>
                      <span className="text-[10px] text-[#577064]"> / day</span>
                    </div>
                    <span className="text-xs text-[#8ba398]">
                      ₹{vehicle.pricePerHour}/hr
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-[#0a110e] border-t border-[#1c3229] flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#8ba398] group-hover:text-[#00D26A] transition-colors"
                >
                  <Eye size={13} />
                  <span>Inspect</span>
                </button>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(vehicle.id, vehicle.status);
                    }}
                    className="p-1 text-[#8ba398] hover:text-white"
                    title="Toggle Available / Maintenance"
                  >
                    <RefreshCw size={13} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      (onDeleteVehicle ? onDeleteVehicle(vehicle.id) : handleDeleteVehicle(vehicle.id));
                    }}
                    className="p-1 text-rose-400 hover:text-rose-300"
                    title="Remove vehicle"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1c3229] text-[11px] text-[#577064] uppercase font-medium">
                <th className="pb-3 px-2">Vehicle</th>
                <th className="pb-3 px-2">Reg #</th>
                <th className="pb-3 px-2">Category</th>
                <th className="pb-3 px-2">Fuel / Trans</th>
                <th className="pb-3 px-2">Odometer</th>
                <th className="pb-3 px-2">Daily Rate</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Verification</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c3229]/60 text-xs">
              {filteredVehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="hover:bg-[#1a2e24] cursor-pointer transition-colors group select-none"
                  title="Click anywhere on row to inspect vehicle details"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-10 h-8 rounded object-cover border border-[#1c3229] group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <span className="font-semibold text-white block group-hover:text-[#00D26A] transition-colors">{vehicle.name}</span>
                        <span className="text-[10px] text-[#8ba398]">{vehicle.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-mono text-[#8ba398]">
                    {vehicle.registrationNo || vehicle.registrationNumber}
                  </td>
                  <td className="py-3 px-2 text-white">{vehicle.category}</td>
                  <td className="py-3 px-2 text-[#8ba398]">
                    {vehicle.fuelType} / {vehicle.transmission}
                  </td>
                  <td className="py-3 px-2 font-mono text-white">
                    {Number(vehicle.odometerReading || 0).toLocaleString()} km
                  </td>
                  <td className="py-3 px-2 font-semibold text-white">
                    ₹{vehicle.pricePerDay}
                  </td>
                  <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(vehicle.id, vehicle.status);
                      }}
                      title="Click to toggle status"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {getStatusBadge(vehicle.status)}
                    </button>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        vehicle.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-500/15 text-[#00D26A]'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {vehicle.verificationStatus || 'PENDING'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="p-1.5 text-[#00D26A] hover:bg-[#00D26A]/10 rounded-lg transition-colors"
                        title="View Full Vehicle Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => (onDeleteVehicle ? onDeleteVehicle(vehicle.id) : handleDeleteVehicle(vehicle.id))}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Remove vehicle"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Vehicle Detail Inspection Modal */}
      {selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onVehicleUpdated={loadVehicles}
        />
      )}
    </div>
  );
};
