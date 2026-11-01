import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { subscriptionService } from '../services/subscriptionService';
import { Sparkles, Check, ShieldCheck, Clock, Zap, AlertCircle } from 'lucide-react';

const FALLBACK_PLANS = [
  {
    id: 'plan_silver',
    name: 'Silver Explorer',
    category: 'SCOOTY',
    price: 999,
    durationDays: 30,
    includedHours: 15,
    discountPercent: 10,
    features: ['15 Free Rental Hours', '10% Off All Additional Hours', 'Zero Security Deposit', 'Priority Hub Pickup'],
  },
  {
    id: 'plan_gold',
    name: 'Gold Nomad',
    category: 'HATCHBACK',
    price: 2499,
    durationDays: 30,
    includedHours: 40,
    discountPercent: 15,
    isPopular: true,
    features: ['40 Free Rental Hours', '15% Off All Future Rides', 'Zero Security Deposit', 'Complimentary Fastag', '24/7 Roadside Assistance'],
  },
  {
    id: 'plan_platinum',
    name: 'Platinum Velocity',
    category: 'SUV',
    price: 4999,
    durationDays: 30,
    includedHours: 100,
    discountPercent: 20,
    features: ['100 Free Rental Hours', '20% Flat Discount', 'Unlimited Doorstep Handover', 'Zero Security Deposit', 'Dedicated Concierge Support'],
  },
];

export default function SubscriptionsPage() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [plans, setPlans] = useState([]);
  const [mySubscription, setMySubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadPlansAndSubscription();
  }, [isAuthenticated]);

  const loadPlansAndSubscription = async () => {
    try {
      setLoading(true);
      const [plansData, subData] = await Promise.allSettled([
        subscriptionService.getActivePlans(),
        isAuthenticated ? subscriptionService.getMySubscription() : Promise.resolve(null),
      ]);

      if (plansData.status === 'fulfilled' && Array.isArray(plansData.value) && plansData.value.length > 0) {
        setPlans(plansData.value);
      } else {
        setPlans(FALLBACK_PLANS);
      }

      if (subData.status === 'fulfilled' && subData.value) {
        setMySubscription(subData.value);
      } else {
        setMySubscription(null);
      }
    } catch (err) {
      console.warn('Error loading subscription data:', err);
      setPlans(FALLBACK_PLANS);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    try {
      setSubscribingId(plan.id);
      const order = await subscriptionService.createOrder({
        planId: plan.id,
        autoRenew: false,
      });

      if (order && window.Razorpay && order.razorpayOrderId) {
        const options = {
          key: order.keyId || 'rzp_test_key',
          amount: order.amount,
          currency: 'INR',
          name: 'CountryDrive Membership',
          description: `Subscription: ${plan.name}`,
          order_id: order.razorpayOrderId,
          handler: async (response) => {
            try {
              await subscriptionService.verifyPayment({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });
              showToast('Membership activated successfully! Enjoy your perks.', 'success');
              loadPlansAndSubscription();
            } catch (vErr) {
              showToast(vErr.message || 'Payment verification failed', 'error');
            }
          },
          theme: { color: '#FF7A00' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback or dev activation
        showToast(`Membership order initialized for ${plan.name}`, 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to initiate membership order', 'error');
    } finally {
      setSubscribingId(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!mySubscription?.id) return;
    if (!window.confirm('Are you sure you want to cancel your active membership? You will retain perks until the end of the billing period.')) {
      return;
    }

    try {
      setCancelling(true);
      await subscriptionService.cancelSubscription(mySubscription.id, {
        reason: 'Customer initiated cancellation',
      });
      showToast('Membership cancelled successfully', 'info');
      loadPlansAndSubscription();
    } catch (err) {
      showToast(err.message || 'Failed to cancel subscription', 'error');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="how-it-works-page">
      <div className="section-inner">
        <div className="info-page-header">
          <span className="hero-eyebrow" style={{ color: 'var(--orange-primary)' }}>MEMBERSHIP PRIVILEGES</span>
          <h1>CountryDrive Subscriptions</h1>
          <p>Unlock zero security deposits, included free hours, and exclusive discounts on every ride.</p>
        </div>

        {/* Active Subscription Status Banner */}
        {mySubscription && (
          <div style={{
            background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px 28px',
            marginBottom: '40px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={20} color="#FF7A00" />
                <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.05em', color: '#FF7A00', textTransform: 'uppercase' }}>
                  Active Member
                </span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0', color: '#fff' }}>
                {mySubscription.plan?.name || 'Active Membership'}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#D1D5DB' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={14} color="#FF7A00" />
                  Expires: {mySubscription.endsAt ? new Date(mySubscription.endsAt).toLocaleDateString() : 'Active'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={14} color="#10B981" />
                  Zero Security Deposit Active
                </span>
              </div>
            </div>

            <button
              onClick={handleCancelSubscription}
              disabled={cancelling}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#EF4444',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Membership'}
            </button>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px',
          marginBottom: '50px',
        }}>
          {plans.map((plan) => {
            const isPopular = plan.isPopular || plan.name?.toLowerCase().includes('gold');
            return (
              <div
                key={plan.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  border: isPopular ? '2px solid var(--orange-primary)' : '1px solid #E5E7EB',
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: isPopular ? '0 12px 32px rgba(255, 122, 0, 0.12)' : '0 4px 16px rgba(0,0,0,0.04)',
                }}
              >
                {isPopular && (
                  <span style={{
                    position: 'absolute',
                    top: '-13px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--orange-primary)',
                    color: '#fff',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '800',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    MOST POPULAR
                  </span>
                )}

                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: '#111827' }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px 0' }}>
                  Perfect for frequent daily commuters and weekend explorers.
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '32px', fontWeight: '900', color: '#111827' }}>₹{plan.price}</span>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>/ month</span>
                </div>

                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '20px', marginBottom: '28px', flexGrow: 1 }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(plan.features || [
                      `${plan.includedHours || 20} Free Rental Hours Included`,
                      `${plan.discountPercent || 15}% Discount on Additional Hours`,
                      'Zero Security Deposit on all bookings',
                      'Free Cancellation up to 2 hours before trip',
                    ]).map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#374151' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#FFF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                          <Check size={12} color="#FF7A00" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={subscribingId === plan.id}
                  className="btn-app"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    background: isPopular ? 'var(--orange-primary)' : '#111827',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '13px',
                    fontWeight: '700',
                  }}
                >
                  {subscribingId === plan.id ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Benefits Footer Highlight */}
        <div className="info-cta-box" style={{ marginTop: '20px' }}>
          <h2>Why Join the CountryDrive Club?</h2>
          <p>Never worry about blocked deposit funds again. Simply pick up any car or scooter, drive, and drop off.</p>
        </div>
      </div>
    </div>
  );
}
