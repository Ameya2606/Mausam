import React, { useState } from 'react';
import { getApiBase } from '../lib/api';
import { Sprout, Loader2 } from 'lucide-react';

export const CropPredictionCard: React.FC = () => {
  const [formData, setFormData] = useState({
    Nitrogen: '',
    Phosporus: '',
    Potassium: '',
    Temperature: '',
    Humidity: '',
    Ph: '',
    Rainfall: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ crop: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/crop/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Nitrogen: Number(formData.Nitrogen),
          Phosporus: Number(formData.Phosporus),
          Potassium: Number(formData.Potassium),
          Temperature: Number(formData.Temperature),
          Humidity: Number(formData.Humidity),
          Ph: Number(formData.Ph),
          Rainfall: Number(formData.Rainfall),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to predict crop');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="crop" className="rounded-2xl glass-panel p-4 sm:p-6 space-y-6 shadow-sm border border-emerald-100 dark:border-emerald-900/50 bg-white/70 dark:bg-slate-900/70">
      <div className="flex items-center gap-3 border-b border-emerald-100 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-green-600 flex items-center justify-center text-white shadow-md">
          <Sprout className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">Crop Intelligence</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">AI-Powered precision farming recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Nitrogen (N)</label>
                <input type="number" name="Nitrogen" value={formData.Nitrogen} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Phosphorus (P)</label>
                <input type="number" name="Phosporus" value={formData.Phosporus} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Potassium (K)</label>
                <input type="number" name="Potassium" value={formData.Potassium} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Temperature (°C)</label>
                <input type="number" step="0.01" name="Temperature" value={formData.Temperature} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Humidity (%)</label>
                <input type="number" step="0.01" name="Humidity" value={formData.Humidity} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">pH Level</label>
                <input type="number" step="0.01" name="Ph" value={formData.Ph} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Rainfall (mm)</label>
                <input type="number" step="0.01" name="Rainfall" value={formData.Rainfall} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sprout className="w-4 h-4" />}
              {loading ? 'Analyzing Soil & Climate...' : 'Predict Ideal Crop'}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 min-h-[300px]">
          {error && (
            <div className="text-center p-4 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-sm w-full">
              {error}
            </div>
          )}
          
          {!result && !error && !loading && (
            <div className="text-center text-slate-400">
              <Sprout className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Enter the N-P-K, temperature, humidity, pH, and rainfall values to get an AI prediction for the best crop to cultivate.</p>
            </div>
          )}

          {result && (
            <div className="text-center w-full animate-in fade-in zoom-in duration-300">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-4 border border-emerald-200 dark:border-emerald-800">
                Recommended Match
              </span>
              <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 capitalize mb-2">{result.crop}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{result.message}</p>
              
              <div className="w-full max-w-[240px] aspect-video mx-auto overflow-hidden rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-lg relative bg-white dark:bg-slate-800">
                <img 
                  src={`/images/crops/${result.crop.toLowerCase()}.jpg`} 
                  alt={result.crop}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/images/crops/fallback.jpg' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
