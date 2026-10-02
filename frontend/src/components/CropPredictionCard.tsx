import React, { useState, useEffect } from 'react';
import { getApiBase } from '../lib/api';
import { Sprout, Loader2, AlertTriangle } from 'lucide-react';

export const CROP_VALIDATION = {
  Nitrogen: { min: 0, max: 140, softMin: 0, softMax: 140, unit: 'kg/ha', label: 'Nitrogen (N)' },
  Phosporus: { min: 5, max: 145, softMin: 5, softMax: 145, unit: 'kg/ha', label: 'Phosphorus (P)' },
  Potassium: { min: 5, max: 205, softMin: 5, softMax: 205, unit: 'kg/ha', label: 'Potassium (K)' },
  Temperature: { min: 5, max: 50, softMin: 8.8, softMax: 43.7, unit: '°C', label: 'Temperature' },
  Humidity: { min: 10, max: 100, softMin: 14.3, softMax: 100, unit: '%', label: 'Humidity' },
  Ph: { min: 3, max: 10, softMin: 3.5, softMax: 9.9, unit: 'pH', label: 'pH Level' },
  Rainfall: { min: 20, max: 300, softMin: 20.2, softMax: 298.6, unit: 'mm', label: 'Rainfall' },
};

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

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fieldWarnings, setFieldWarnings] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ crop: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateField = (name: string, value: string) => {
    if (value === '') return { error: null, warning: null };
    const num = Number(value);
    const rule = CROP_VALIDATION[name as keyof typeof CROP_VALIDATION];
    
    if (isNaN(num)) return { error: 'Must be a valid number', warning: null };
    if (num < rule.min || num > rule.max) {
      return { error: `${rule.label} must be between ${rule.min} and ${rule.max} ${rule.unit}`, warning: null };
    }
    if (num < rule.softMin || num > rule.softMax) {
      return { error: null, warning: 'Unusual value; prediction may be unreliable.' };
    }
    return { error: null, warning: null };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    const { error, warning } = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error || '' }));
    setFieldWarnings(prev => ({ ...prev, [name]: warning || '' }));
  };

  const isFormValid = () => {
    const hasEmptyFields = Object.values(formData).some(val => val === '');
    const hasErrors = Object.values(fieldErrors).some(err => err !== '');
    return !hasEmptyFields && !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation sweep
    let valid = true;
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([name, value]) => {
      const { error } = validateField(name, value);
      if (error || value === '') {
        newErrors[name] = error || 'Field is required';
        valid = false;
      }
    });
    setFieldErrors(newErrors);
    
    if (!valid) return;

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
        
        // Handle FastAPI Pydantic validation errors (422)
        if (res.status === 422 && errorData.detail) {
           const issues = Array.isArray(errorData.detail) 
            ? errorData.detail.map((err: any) => `${err.loc?.[1] || 'Field'}: ${err.msg}`).join(', ')
            : errorData.detail;
           throw new Error(`Validation failed: ${issues}`);
        }
        
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

  const renderInput = (name: keyof typeof CROP_VALIDATION, step: string = '1') => {
    const rule = CROP_VALIDATION[name];
    const hasError = !!fieldErrors[name];
    const hasWarning = !!fieldWarnings[name];
    
    return (
      <div className={`space-y-1 ${name === 'Rainfall' ? 'col-span-2' : ''}`}>
        <label className={`text-[11px] font-bold uppercase tracking-wider ${hasError ? 'text-rose-500' : hasWarning ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300'}`}>
          {rule.label}
        </label>
        <input 
          type="number" 
          name={name} 
          value={formData[name]} 
          onChange={handleChange} 
          min={rule.min}
          max={rule.max}
          step={step}
          required 
          className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900/60 dark:[color-scheme:dark] text-slate-900 dark:text-slate-100 text-sm focus:outline-none shadow-inner transition-all
            ${hasError 
              ? 'border-rose-400 dark:border-rose-500/60 focus:ring-2 focus:ring-rose-500/50' 
              : hasWarning 
                ? 'border-amber-400 dark:border-amber-500/60 focus:ring-2 focus:ring-amber-500/50' 
                : 'border-slate-200 dark:border-slate-700/60 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500'
            }`} 
        />
        {hasError && (
          <p className="text-[10px] text-rose-500 mt-1 font-medium leading-tight">{fieldErrors[name]}</p>
        )}
        {!hasError && hasWarning && (
          <p className="text-[10px] text-amber-500 mt-1 font-medium flex items-start gap-1 leading-tight">
            <AlertTriangle className="w-3 h-3 shrink-0" /> {fieldWarnings[name]}
          </p>
        )}
      </div>
    );
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
              {renderInput('Nitrogen')}
              {renderInput('Phosporus')}
              {renderInput('Potassium')}
              {renderInput('Temperature', '0.01')}
              {renderInput('Humidity', '0.01')}
              {renderInput('Ph', '0.01')}
              {renderInput('Rainfall', '0.01')}
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !isFormValid()} 
              className={`w-full py-3 rounded-xl text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2
                ${loading || !isFormValid() 
                  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-70' 
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:shadow-lg'
                }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sprout className="w-4 h-4" />}
              {loading ? 'Analyzing Soil & Climate...' : 'Predict Ideal Crop'}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/60 shadow-inner rounded-2xl border border-slate-100 dark:border-slate-800/80 p-6 min-h-[300px] relative overflow-hidden">
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
