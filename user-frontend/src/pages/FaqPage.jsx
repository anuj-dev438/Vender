import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'What documents do I need to rent a vehicle on Country Drive?',
      a: 'You need an original, valid Indian Driving License (permanent, not learner) matching the vehicle category (MCWG for two-wheelers, LMV for cars), along with government photo ID (Aadhaar Card or Passport).'
    },
    {
      q: 'How does the refundable security deposit work?',
      a: 'A refundable security deposit (typically ₹1,000 for Scooty/Bike, ₹3,000 for Cars) is held during your trip and automatically released back to your original payment method within 24 hours of successful vehicle inspection.'
    },
    {
      q: 'What is the fuel policy?',
      a: 'We operate on a "Same-to-Same" fuel policy. You will receive the vehicle with a specified fuel level (e.g. 100% full tank) and you should return it with the same level. Free fuel packages are also available.'
    },
    {
      q: 'Can I extend my rental duration while on trip?',
      a: 'Yes! You can extend your rental duration directly through the app or website prior to your scheduled return time, subject to vehicle availability.'
    },
    {
      q: 'What happens in case of a breakdown or accident?',
      a: 'All Country Drive vehicles come with 24/7 on-road roadside assistance and comprehensive insurance. In an emergency, simply tap the SOS button on your active trip screen or call our 24/7 hotline at 1800-123-4567.'
    },
    {
      q: 'What is the cancellation policy?',
      a: 'You can cancel free of charge up to 2 hours before your scheduled pickup time. Cancellations within 2 hours of trip start are subject to a nominal fee equivalent to 1 hour rental.'
    }
  ];

  return (
    <div className="faq-page">
      <div className="section-inner faq-container">
        <div className="info-page-header">
          <span className="hero-eyebrow" style={{ color: 'var(--orange-primary)' }}>HELP &amp; ANSWERS</span>
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about Country Drive rentals, security deposits, and policies.</p>
        </div>

        <div className="faq-accordion-stack">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div className={`faq-accordion-item ${isOpen ? 'open' : ''}`} key={idx}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </button>
                {isOpen && (
                  <div className="faq-answer-body">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
