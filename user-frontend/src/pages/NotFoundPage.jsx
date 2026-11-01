import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="section-inner not-found-box">
        <Compass size={64} color="var(--orange-primary)" />
        <h1>404 — Road Not Found</h1>
        <p>The road you are trying to take doesn't exist or has moved. Let's get you back on track.</p>
        <Link to="/" className="btn-app" style={{ display: 'inline-flex', marginTop: '20px' }}>
          <span>Back to CountryDrive Home</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
