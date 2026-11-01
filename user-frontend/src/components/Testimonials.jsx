import React, { useState } from 'react';
import { testimonials } from '../data/mockData';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';

export default function Testimonials() {
  const [items, setItems] = useState(testimonials);

  const handleNext = () => {
    setItems((prev) => {
      const copy = [...prev];
      const first = copy.shift();
      copy.push(first);
      return copy;
    });
  };

  const handlePrev = () => {
    setItems((prev) => {
      const copy = [...prev];
      const last = copy.pop();
      copy.unshift(last);
      return copy;
    });
  };

  return (
    <section className="testimonial-section" id="testimonials">
      <div className="section-inner">
        <div className="testimonial-layout">
          <div className="testimonial-intro">
            <span className="testimonial-eyebrow">Testimonials</span>
            <h2 className="testimonial-heading">What Our<br />Customers Say</h2>
            <p className="testimonial-description">
              Real experiences from riders who love<br />Country Drive
            </p>
          </div>

          <div className="testimonial-carousel">
            <div className="testimonial-controls" aria-label="Testimonial navigation">
              <button
                type="button"
                className="testimonial-nav testimonial-prev"
                aria-label="Previous testimonials"
                onClick={handlePrev}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                className="testimonial-nav testimonial-next"
                aria-label="Next testimonials"
                onClick={handleNext}
              >
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="testimonial-track">
              {items.map((t) => (
                <article className="testimonial-card" key={t.id}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="testimonial-avatar"
                  />
                  <div className="testimonial-card-content">
                    <div className="testimonial-stars" role="img" aria-label="5 out of 5 stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#FFB800" color="#FFB800" />
                      ))}
                    </div>
                    <p className="testimonial-text">{t.text}</p>
                    <div className="testimonial-person">
                      <strong className="testimonial-name">{t.name}</strong>
                      <span className="testimonial-role">{t.location} • {t.role}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
