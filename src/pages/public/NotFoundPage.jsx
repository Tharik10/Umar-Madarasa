import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import SeoHead from '../../components/common/SeoHead';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <SeoHead title="Page Not Found" />
      <span className="text-6xl font-extrabold text-amber-500 mb-2">404</span>
      <h1 className="text-2xl font-extrabold text-emerald-950 mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-600 max-w-md mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-bold transition"
      >
        <Home className="w-4 h-4 text-amber-300" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
