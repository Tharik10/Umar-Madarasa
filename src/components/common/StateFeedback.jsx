import React from 'react';
import { Loader2, FolderOpen, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function LoadingSpinner({ message }) {
  const { t } = useLanguage();
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <Loader2 className="w-9 h-9 text-emerald-800 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600">{message || t('loading')}</p>
    </div>
  );
}

export function EmptyState({ title, description }) {
  const { t } = useLanguage();
  return (
    <div className="py-14 px-6 bg-white border border-emerald-900/10 rounded-2xl text-center max-w-lg mx-auto shadow-xs">
      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-3">
        <FolderOpen className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-emerald-950 mb-1">{title || t('noRecords')}</h3>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
