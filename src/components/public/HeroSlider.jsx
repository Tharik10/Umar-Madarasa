import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function HeroSlider({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const { pick } = useLanguage();

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length, paused]);

  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [slides.length, current]);

  if (!slides.length) return null;

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section
      className="relative w-full h-[380px] sm:h-[470px] lg:h-[540px] overflow-hidden bg-emerald-950 rounded-3xl shadow-2xl border border-amber-400/30"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Madarasa Highlights Image Slider"
    >
      {slides.map((slide, idx) => {
        const active = idx === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image_url}
              alt={pick(slide, 'title')}
              className="w-full h-full object-cover object-center"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/45 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 lg:p-12 text-white">
              <div className="max-w-3xl">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                  Umar Makthab & Hifl Madarasa
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-2">
                  {pick(slide, 'title')}
                </h2>
                {pick(slide, 'caption') && (
                  <p className="text-sm sm:text-base text-emerald-100/90 line-clamp-2 mb-4">
                    {pick(slide, 'caption')}
                  </p>
                )}
                {slide.cta_link && (
                  <Link
                    to={slide.cta_link}
                    className="inline-flex items-center px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-sm font-bold shadow transition"
                  >
                    {slide.cta_label_en || 'Learn More'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-emerald-950/75 hover:bg-emerald-900 text-amber-300 border border-amber-400/30 transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-emerald-950/75 hover:bg-emerald-900 text-amber-300 border border-amber-400/30 transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === current ? 'w-7 bg-amber-400' : 'w-2.5 bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
