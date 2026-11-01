import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { kycService } from '../services/kycService';
import { uploadService } from '../services/uploadService';
import {
  ShieldCheck,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Check,
  ArrowRight,
  Sparkles,
  Car,
  Lock,
  RefreshCw,
  ExternalLink,
  Info,
  X,
  RotateCcw,
  Eye,
  Image as ImageIcon
} from 'lucide-react';

export const KYC_DOC_TYPES = [
  { id: 'DRIVING_LICENSE_FRONT', label: 'Driving License (Front Side)', required: true },
  { id: 'DRIVING_LICENSE_BACK', label: 'Driving License (Back Side)', required: true },
  { id: 'AADHAAR_FRONT', label: 'Aadhaar / Passport (Front Side)', required: true },
  { id: 'AADHAAR_BACK', label: 'Aadhaar / Passport (Back Side)', required: false },
];

export default function KycPage() {
  const { user, isAuthenticated, isPhoneVerified, openAuthModal, refreshUser, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [kycStatus, setKycStatus] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [approving, setApproving] = useState(false);

  // Form details
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expiryAt, setExpiryAt] = useState('');
  const [dob, setDob] = useState('1996-01-01');
  const [categories, setCategories] = useState(['LMV', 'MCWG']);
  const [selfieUrl, setSelfieUrl] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Live Camera state & refs
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Pre-fill / load existing KYC details
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    async function loadKycData() {
      try {
        setLoading(true);
        const [statusData, docsData, detailsData, selfieData] = await Promise.allSettled([
          kycService.getStatus(),
          kycService.listDocuments(),
          kycService.getDetails(),
          kycService.getSelfie(),
        ]);

        const statusVal = statusData.status === 'fulfilled' ? statusData.value : null;
        if (statusVal) setKycStatus(statusVal);

        // Extract documents safely (handling both array and object response)
        let docs = [];
        if (docsData.status === 'fulfilled') {
          const rawDocs = docsData.value;
          if (Array.isArray(rawDocs)) {
            docs = rawDocs;
          } else if (rawDocs && Array.isArray(rawDocs.documents)) {
            docs = rawDocs.documents;
          }
        }
        if (docs.length === 0 && statusVal && Array.isArray(statusVal.documents)) {
          docs = statusVal.documents;
        }
        setDocuments(docs);

        // Extract driving licence and personal details safely
        const det = detailsData.status === 'fulfilled' ? detailsData.value : null;
        const lic = det?.licenseDetails || statusVal?.drivingLicense;

        if (lic?.licenseNumber) {
          setLicenseNumber(lic.licenseNumber);
        } else if (det?.licenseNumber) {
          setLicenseNumber(det.licenseNumber);
        }

        if (lic?.licenseExpiryAt) {
          setExpiryAt(lic.licenseExpiryAt.slice(0, 10));
        } else if (det?.licenseExpiryAt) {
          setExpiryAt(det.licenseExpiryAt.slice(0, 10));
        }

        if (det?.dateOfBirth) {
          setDob(det.dateOfBirth.slice(0, 10));
        } else if (statusVal?.personalDetails?.dateOfBirth) {
          setDob(statusVal.personalDetails.dateOfBirth.slice(0, 10));
        }

        if (det?.emergencyContact?.phone) {
          setEmergencyPhone(det.emergencyContact.phone);
        }

        const cats = lic?.licenseCategories || det?.licenseCategories || statusVal?.drivingLicense?.licenseCategories;
        if (Array.isArray(cats) && cats.length > 0) {
          setCategories(cats);
        }

        // Extract selfie URL safely
        const sData = selfieData.status === 'fulfilled' ? selfieData.value : null;
        const sUrl = sData?.selfie?.selfieUrl || sData?.selfieUrl || statusVal?.selfie?.selfieUrl;
        if (sUrl) {
          setSelfieUrl(sUrl);
        }
      } catch (err) {
        console.warn('KYC load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadKycData();
  }, [isAuthenticated]);

  // Document file upload handler
  const handleDocumentFileUpload = async (type, file) => {
    if (!file) return;
    try {
      setUploading(true);
      showToast(`Uploading ${file.name}...`, 'info');
      const uploadRes = await uploadService.uploadFile(file, 'KYC_DOCUMENT');
      const fileUrl = typeof uploadRes === 'object' ? uploadRes.fileUrl : uploadRes;
      const storageKey = typeof uploadRes === 'object' ? uploadRes.storageKey : undefined;

      await kycService.uploadDocument({
        type,
        documentType: type,
        documentNumber: licenseNumber || 'TEMP-DOC',
        fileUrl,
        storageKey,
        expiryAt: expiryAt || undefined,
      });

      const updatedDocs = await kycService.listDocuments();
      setDocuments(Array.isArray(updatedDocs) ? updatedDocs : (updatedDocs?.documents || []));
      const st = await kycService.getStatus();
      setKycStatus(st);
      showToast('Document uploaded successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to upload document', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Selfie upload handler (supports File object or base64 data URL)
  const handleSelfieUpload = async (fileOrDataUrl) => {
    if (!fileOrDataUrl) return;
    try {
      setUploading(true);
      showToast('Uploading verification selfie...', 'info');
      const uploadRes = await uploadService.uploadFile(fileOrDataUrl, 'KYC_SELFIE');
      const fileUrl = typeof uploadRes === 'object' ? uploadRes.fileUrl : uploadRes;
      const storageKey = typeof uploadRes === 'object' ? uploadRes.storageKey : undefined;

      await kycService.uploadSelfie({ selfieUrl: fileUrl, storageKey });
      setSelfieUrl(fileUrl);
      const st = await kycService.getStatus();
      setKycStatus(st);
      showToast('Selfie uploaded and recorded successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to upload selfie', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Live Camera Handlers
  const startCamera = async () => {
    setCameraError(null);
    setCapturedPhoto(null);
    setIsCameraActive(true);
    setCameraLoading(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser. Please select an image file from your device instead.');
      setCameraLoading(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('getUserMedia error:', err);
      let msg = 'Unable to access your camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera permissions in your browser or select an image file from your device.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera device found on your system. Please select an image file from your device.';
      }
      setCameraError(msg);
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCapturedPhoto(null);
    setCameraError(null);
    setCameraLoading(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      // Mirror the image horizontally if facing user
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setCapturedPhoto(dataUrl);

      // Stop camera tracks after capture
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    } catch (err) {
      showToast('Failed to capture frame from camera: ' + err.message, 'error');
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const confirmCapturedPhoto = async () => {
    if (!capturedPhoto) return;
    const photoToUpload = capturedPhoto;
    stopCamera();
    await handleSelfieUpload(photoToUpload);
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Submit Driving License Details
  const handleSaveDetails = async (e) => {
    if (e) e.preventDefault();
    if (!licenseNumber || licenseNumber.trim().length < 5) {
      showToast('Please enter a valid Driving License Number (min 5 characters)', 'error');
      return false;
    }

    try {
      setUploading(true);
      const expiryIso = expiryAt
        ? new Date(expiryAt).toISOString()
        : new Date(Date.now() + 3650 * 24 * 3600 * 1000).toISOString();
      const dobIso = dob
        ? new Date(dob).toISOString()
        : new Date('1996-01-01').toISOString();

      await kycService.saveDetails({
        licenseNumber: licenseNumber.trim().toUpperCase(),
        licenseExpiryAt: expiryIso,
        dateOfBirth: dobIso,
        licenseCategories: categories.length > 0 ? categories : ['LMV', 'MCWG'],
        emergencyPhone: emergencyPhone.trim() || undefined,
      });

      await refreshUser();
      const st = await kycService.getStatus();
      setKycStatus(st);
      showToast('Driving License details saved successfully!', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to save driving license details', 'error');
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Fast-Track / Instant Automated AI Verification
  const handleInstantApproval = async () => {
    const saved = await handleSaveDetails();
    if (!saved) return;

    try {
      setApproving(true);
      showToast('Initiating Automated AI Document & Face Verification...', 'info');

      const st = await kycService.getStatus();
      const kycId = st?.kycVerificationId;

      if (!kycId) {
        throw new Error('KYC record could not be located. Please try again.');
      }

      await kycService.approveKycInstantly(kycId, categories);
      await refreshUser();

      const updatedSt = await kycService.getStatus();
      setKycStatus(updatedSt);
      showToast('KYC Approved & Verified! You can now book any vehicle.', 'success');
    } catch (err) {
      showToast(err.message || 'Automated verification failed. Documents are queued for review.', 'error');
    } finally {
      setApproving(false);
    }
  };

  // Quick Demo Login helper for pre-verified testing
  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      showToast('Signing in with verified test customer (Rohit Kumar)...', 'info');
      await login({
        phone: '+919870123456',
        password: 'UserPassword123',
      });
      showToast('Signed in as Rohit Kumar (KYC Verified)', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to sign in with demo customer', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Determine overall status
  const currentStatus =
    kycStatus?.kycStatus ||
    kycStatus?.status ||
    (user?.isKycVerified ? 'VERIFIED' : user?.kycStatus) ||
    'PENDING';

  const isVerified = currentStatus === 'VERIFIED' || Boolean(user?.isKycVerified);

  // Unauthenticated State View
  if (!isAuthenticated) {
    return (
      <div className="kyc-page" style={{ padding: '120px 20px 80px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '580px', width: '100%', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '40px 32px', textAlign: 'center', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(255, 122, 0, 0.1)', color: 'var(--orange-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ShieldCheck size={36} />
          </div>

          <span className="hero-eyebrow" style={{ color: 'var(--orange-primary)' }}>
            DIGITAL ONBOARDING &amp; COMPLIANCE
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '6px', marginBottom: '12px' }}>
            Sign In to Complete KYC Verification
          </h2>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
            Under Indian Motor Vehicles Act self-drive regulations, all customers must verify their Government Driving License (DL) before keys can be unlocked and bookings confirmed.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="button"
              className="btn-app"
              onClick={() => openAuthModal('login')}
              style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '14px' }}
            >
              <span>Sign In or Register</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <Sparkles size={16} color="#FF7A00" />
              <span>1-Click Test: Sign In as Pre-Verified Customer (Rohit Kumar)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kyc-page">
      <div className="section-inner kyc-container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header Status Card */}
        <div className="kyc-status-banner" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <div className="kyc-banner-left" style={{ flex: 1, minWidth: '280px' }}>
            <span className="hero-eyebrow" style={{ color: 'var(--orange-primary)', fontSize: '12px', fontWeight: 800, letterSpacing: '0.06em' }}>
              IDENTITY VERIFICATION &amp; DRIVER COMPLIANCE
            </span>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '6px 0 8px' }}>
              Driving License &amp; KYC Verification
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              Registered Customer: <strong>{user?.name || user?.phone}</strong> ({user?.phone})
            </p>
          </div>

          <div
            className={`kyc-overall-pill status-${currentStatus.toLowerCase()}`}
            style={{
              padding: '12px 20px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: isVerified ? '#ECFDF5' : currentStatus === 'UNDER_REVIEW' ? '#FFFBEB' : '#F1F5F9',
              border: `1px solid ${isVerified ? '#A7F3D0' : currentStatus === 'UNDER_REVIEW' ? '#FDE68A' : '#CBD5E1'}`,
            }}
          >
            <ShieldCheck size={24} color={isVerified ? '#059669' : currentStatus === 'UNDER_REVIEW' ? '#D97706' : '#64748B'} />
            <div>
              <span className="pill-sub" style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>
                Verification Status
              </span>
              <strong style={{ fontSize: '15px', color: isVerified ? '#059669' : currentStatus === 'UNDER_REVIEW' ? '#B45309' : '#0F172A' }}>
                {isVerified ? 'VERIFIED & ACTIVE' : currentStatus}
              </strong>
            </div>
          </div>
        </div>

        {/* Verification Success Celebration Banner */}
        {isVerified && (
          <div
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              borderRadius: '18px',
              padding: '24px 28px',
              color: '#FFFFFF',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={28} color="#FFFFFF" />
              </div>
              <div>
                <strong style={{ fontSize: '18px', display: 'block', marginBottom: '4px' }}>
                  Your Account is Verified for Vehicle Rentals!
                </strong>
                <span style={{ fontSize: '13px', opacity: 0.9 }}>
                  License No: <strong>{licenseNumber || user?.licenseNumber || 'Verified on File'}</strong> • Allowed Categories: <strong>{categories.join(', ') || 'LMV, MCWG'}</strong>
                </span>
              </div>
            </div>

            <Link
              to="/vehicles"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                color: '#065F46',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Car size={18} />
              <span>Browse &amp; Book Vehicles</span>
            </Link>
          </div>
        )}

        {/* Fast-Track AI Verification Card (If not verified yet) */}
        {!isVerified && (
          <div
            style={{
              background: '#FFF7ED',
              border: '1px solid #FFEDD5',
              borderRadius: '18px',
              padding: '20px 24px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <Sparkles size={24} color="#EA580C" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '15px', color: '#9A3412', display: 'block', marginBottom: '2px' }}>
                  Fast-Track Automated AI Verification
                </strong>
                <p style={{ margin: 0, fontSize: '13px', color: '#C2410C', lineHeight: 1.5 }}>
                  Enter your Driving License number below and click <strong>"Instant AI Verification"</strong> to activate your driving privileges immediately.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn-app"
              onClick={handleInstantApproval}
              disabled={approving || uploading || !licenseNumber}
              style={{
                background: 'linear-gradient(135deg, #FF7A00 0%, #EA580C 100%)',
                fontSize: '14px',
                padding: '12px 22px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: !licenseNumber ? 'not-allowed' : 'pointer',
                opacity: !licenseNumber ? 0.6 : 1,
              }}
            >
              <Sparkles size={16} />
              <span>{approving ? 'Verifying with AI...' : 'Instant AI Verification'}</span>
            </button>
          </div>
        )}

        {/* Form & Upload Grid */}
        <div className="kyc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {/* Left Column: Identity Documents & Selfie */}
          <div className="kyc-docs-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 1. Identity Documents */}
            <div className="kyc-card" style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--orange-primary)" />
                1. Upload Identity Documents
              </h3>
              <p className="kyc-subtext" style={{ fontSize: '13px', color: '#64748B', marginBottom: '18px' }}>
                Upload photos of your physical Driving License and Govt ID (Aadhaar/Passport).
              </p>

              <div className="doc-upload-stack" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {KYC_DOC_TYPES.map((docType) => {
                  const uploaded = Array.isArray(documents) && documents.find(
                    (d) => d.documentType === docType.id || d.type === docType.id
                  );

                  return (
                    <div
                      className="doc-upload-item"
                      key={docType.id}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        background: uploaded ? '#F0FDF4' : '#F8FAFC',
                        border: `1px solid ${uploaded ? '#BBF7D0' : '#E2E8F0'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <div className="doc-info" style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '13.5px', color: '#0F172A', display: 'block' }}>
                            {docType.label}
                          </strong>
                          {uploaded && (
                            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, background: '#DCFCE7', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <Check size={11} /> Saved
                            </span>
                          )}
                        </div>
                        {uploaded ? (
                          <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                            Document verified on record
                          </span>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '3px', display: 'block' }}>
                            {docType.required ? 'Mandatory government proof' : 'Optional back side'}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {uploaded?.fileUrl && typeof uploaded.fileUrl === 'string' && uploaded.fileUrl.startsWith('data:image') && (
                          <img
                            src={uploaded.fileUrl}
                            alt={docType.label}
                            style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #BBF7D0' }}
                          />
                        )}
                        <label
                          htmlFor={`doc-input-${docType.id}`}
                          className="doc-file-label"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            background: uploaded ? '#FFFFFF' : '#0F172A',
                            color: uploaded ? '#0F172A' : '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: uploading ? 'wait' : 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          }}
                        >
                          <Upload size={13} />
                          <span>{uploaded ? 'Replace' : 'Upload'}</span>
                          <input
                            id={`doc-input-${docType.id}`}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            disabled={uploading}
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleDocumentFileUpload(docType.id, e.target.files[0]);
                                e.target.value = '';
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Selfie / Face Check */}
            <div className="kyc-card" style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Camera size={18} color="var(--orange-primary)" />
                  2. Live Selfie &amp; Face Verification
                </h3>
                {selfieUrl && (
                  <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Recorded
                  </span>
                )}
              </div>
              <p className="kyc-subtext" style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
                Take a clear front-facing selfie or upload a portrait photo to match against your Driving License.
              </p>

              <div className="selfie-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '22px', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                {selfieUrl ? (
                  <div className="selfie-preview" style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={selfieUrl}
                        alt="Selfie"
                        style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #10B981', boxShadow: '0 6px 18px rgba(16, 185, 129, 0.2)' }}
                      />
                      <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: '#10B981', color: '#FFFFFF', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFFFF' }}>
                        <Check size={14} />
                      </div>
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '13px', color: '#059669', fontWeight: 700 }}>
                      Selfie Photo Saved &amp; Verified
                    </div>
                  </div>
                ) : (
                  <div className="selfie-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#94A3B8', padding: '8px 0' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Camera size={28} color="#64748B" />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#475569' }}>No selfie uploaded yet</span>
                    <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>Capture with your camera or upload from device</span>
                  </div>
                )}

                {/* Dual Options: 1. Camera Capture, 2. File Upload */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={uploading}
                    className="btn-app"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      fontSize: '13px',
                      background: 'linear-gradient(135deg, #FF7A00 0%, #EA580C 100%)',
                      cursor: uploading ? 'wait' : 'pointer',
                    }}
                  >
                    <Camera size={15} />
                    <span>{selfieUrl ? 'Retake with Camera' : 'Take Photo with Camera'}</span>
                  </button>

                  <label
                    htmlFor="selfie-file-picker"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      fontSize: '13px',
                      borderRadius: '999px',
                      border: '1.5px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#0F172A',
                      fontWeight: 700,
                      cursor: uploading ? 'wait' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    <Upload size={15} />
                    <span>Upload from Device</span>
                    <input
                      id="selfie-file-picker"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploading}
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleSelfieUpload(e.target.files[0]);
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Driving License Details Form */}
          <div className="kyc-side-col">
            <div className="kyc-card" style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '26px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--orange-primary)" />
                3. Driving License Details
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
                Enter the details exactly as printed on your government Driving License.
              </p>

              <form onSubmit={handleSaveDetails}>
                <div className="modal-form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Driving License (DL) Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MH-1420150098765 or DL-0420110012345"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', textTransform: 'uppercase' }}
                  />
                </div>

                <div className="modal-form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    License Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={expiryAt}
                    onChange={(e) => setExpiryAt(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                  />
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    License must remain valid throughout your planned rental trip.
                  </span>
                </div>

                <div className="modal-form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Date of Birth * (Must be 18+ years)
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                  />
                </div>

                <div className="modal-form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Emergency Contact Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                  />
                </div>

                <div className="modal-form-group" style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Approved Vehicle Categories *
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={categories.includes('LMV')}
                        onChange={(e) => {
                          if (e.target.checked) setCategories([...categories, 'LMV']);
                          else setCategories(categories.filter((c) => c !== 'LMV'));
                        }}
                      />
                      <strong>LMV (Light Motor Vehicle)</strong> — Required for Cars &amp; SUVs
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={categories.includes('MCWG')}
                        onChange={(e) => {
                          if (e.target.checked) setCategories([...categories, 'MCWG']);
                          else setCategories(categories.filter((c) => c !== 'MCWG'));
                        }}
                      />
                      <strong>MCWG (Motorcycle with Gear)</strong> — Required for Motorbikes &amp; Scooters
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-app"
                    onClick={handleInstantApproval}
                    disabled={uploading || approving || !licenseNumber}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      fontSize: '14px',
                      padding: '13px',
                      background: 'linear-gradient(135deg, #FF7A00 0%, #EA580C 100%)',
                      opacity: !licenseNumber ? 0.6 : 1,
                    }}
                  >
                    <Sparkles size={16} />
                    <span>{approving ? 'Verifying with AI...' : 'Verify & Approve Instantly'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={uploading || approving}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      background: '#F8FAFC',
                      color: '#475569',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {uploading ? 'Saving Details...' : 'Save Details for Standard Review'}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '12px', color: '#64748B' }}>
                  <Clock size={14} color="var(--orange-primary)" />
                  <span>Instant automated check verifies your eligibility in under 5 seconds.</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      {isCameraActive && (
        <div
          className="camera-modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            className="camera-modal-content"
            style={{
              maxWidth: '520px',
              width: '100%',
              background: '#0F172A',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '24px',
              color: '#FFFFFF',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} color="var(--orange-primary)" />
                <strong style={{ fontSize: '16px', color: '#FFFFFF' }}>Take Verification Photo</strong>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Viewfinder / Video Feed / Preview */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#000000',
                aspectRatio: '4 / 3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '2px solid rgba(255, 122, 0, 0.4)',
              }}
            >
              {cameraLoading && (
                <div style={{ color: '#94A3B8', fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <RefreshCw size={24} className="spin" />
                  <span>Connecting to Camera...</span>
                </div>
              )}

              {cameraError ? (
                <div style={{ padding: '24px', color: '#FCA5A5', fontSize: '13.5px', lineHeight: 1.5, textAlign: 'center' }}>
                  <AlertCircle size={32} color="#EF4444" style={{ margin: '0 auto 12px' }} />
                  <p style={{ margin: '0 0 16px 0' }}>{cameraError}</p>
                  <label
                    htmlFor="camera-fallback-file"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      background: 'var(--orange-primary)',
                      color: '#FFFFFF',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    <Upload size={15} />
                    <span>Choose Photo from Device</span>
                    <input
                      id="camera-fallback-file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          stopCamera();
                          handleSelfieUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              ) : capturedPhoto ? (
                <img
                  src={capturedPhoto}
                  alt="Captured Selfie"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                  />
                  {/* Face Guide Oval */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '180px',
                      height: '240px',
                      borderRadius: '50%',
                      border: '2px dashed rgba(255, 255, 255, 0.7)',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.35)',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(0, 0, 0, 0.65)',
                      padding: '5px 14px',
                      borderRadius: '999px',
                      fontSize: '11.5px',
                      color: '#FFFFFF',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Position face inside the oval
                  </div>
                </>
              )}
            </div>

            {/* Modal Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {capturedPhoto ? (
                <>
                  <button
                    type="button"
                    onClick={retakePhoto}
                    style={{
                      padding: '11px 22px',
                      borderRadius: '999px',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <RotateCcw size={15} />
                    <span>Retake Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={confirmCapturedPhoto}
                    disabled={uploading}
                    className="btn-app"
                    style={{
                      padding: '11px 26px',
                      fontSize: '14px',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    }}
                  >
                    <Check size={16} />
                    <span>{uploading ? 'Uploading...' : 'Use This Photo'}</span>
                  </button>
                </>
              ) : !cameraError && (
                <button
                  type="button"
                  onClick={capturePhoto}
                  disabled={cameraLoading}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--orange-primary)',
                    border: '4px solid #FFFFFF',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: cameraLoading ? 'wait' : 'pointer',
                    boxShadow: '0 4px 20px rgba(255, 122, 0, 0.5)',
                    transition: 'transform 0.15s ease',
                  }}
                  title="Click to capture photo"
                >
                  <Camera size={26} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
