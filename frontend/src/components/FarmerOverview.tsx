'use client';

import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  CloudRain,
  MapPin
} from 'lucide-react';
import { WeatherResponse } from '../lib/types';
import { CropPredictionCard } from './CropPredictionCard';
import { KrishiIntelligenceCard } from './KrishiIntelligenceCard';
import { useLanguage } from '../hooks/useLanguage';
import { getLocalizedWeatherCondition, getLocalizedWeekday } from '../lib/weatherConditions';

interface FarmerOverviewProps {
  weather: WeatherResponse;
  intelligence?: any;
  context?: any;
  onSelectCity?: (city: any) => void;
  onOpenPersonalizeModal?: () => void;
  activeSection?: string;
}

export const FarmerOverview: React.FC<FarmerOverviewProps> = ({
  weather,
  intelligence,
  context,
  onSelectCity,
  onOpenPersonalizeModal,
  activeSection,
}) => {
  const { t, locale, language } = useLanguage();
  const curr = weather.current;
  const loc = weather.location;
  const hourly = weather.hourly || [];
  const daily = weather.daily || [];
  const alerts = weather.alerts || [];

  const formattedLocalTime = React.useMemo(() => {
    try {
      const dateToFormat = curr.observation_time ? new Date(curr.observation_time) : new Date();
      return new Intl.DateTimeFormat(locale || 'en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: loc.timezone || 'Asia/Kolkata',
      }).format(dateToFormat);
    } catch {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }, [curr.observation_time, loc.timezone, locale]);

  return (
    <div className="w-full space-y-6">
      


      {/* 2. Official Weather Warnings (IMD Protocol) */}
      <div id="warnings" className="w-full">
        {alerts.length > 0 ? (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-slate-900 dark:text-slate-100 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-600 text-white">
                  IMD {alerts[0].severity}
                </span>
                <span className="text-xs font-mono text-rose-700 dark:text-rose-400">{alerts[0].source}</span>
              </div>
              <h4 className="text-sm font-bold text-rose-950 dark:text-rose-200 mt-1">{alerts[0].title}</h4>
              <p className="text-xs text-rose-800 dark:text-rose-300 mt-0.5">{alerts[0].description}</p>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">{t.bulletin_title}:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{t.bulletin_no_warnings.replace('{city}', loc.name)}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{t.bulletin_normal}</span>
          </div>
        )}
      </div>

      {/* ── DASHBOARD ─── */}
      <div className="flex flex-col gap-6 items-start w-full">
        
        {/* LEFT COLUMN: Observations, Key Metrics & Multi-Day Forecasts */}
        <div className="space-y-6">
          {/* 3. Base Mausam Current Weather Hero Card */}
          <div id="overview" className="rounded-3xl glass-panel p-4 sm:p-6 md:p-8 space-y-6 shadow-sm border border-sky-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70">
            
            {/* City & Main Numbers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 dark:border-slate-800 pb-6">
              <div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span className="truncate">{loc.state ? `${loc.state}, ` : ''}{loc.country || 'India'}</span>
                  <span>•</span>
                  <span className="font-mono whitespace-nowrap">{formattedLocalTime} {loc.timezone_abbreviation || 'IST'}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#0B1F33] dark:text-white mt-1 tracking-tight">
                  {loc.name}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mt-1">
                  {getLocalizedWeatherCondition(curr.condition_text, language)}
                </p>
              </div>

              <div className="flex items-baseline gap-3 sm:gap-4">
                <div className="text-5xl sm:text-6xl md:text-7xl font-heading font-black text-[#0B1F33] dark:text-white tracking-tight animate-float">
                  {Math.round(curr.temperature)}°<span className="text-2xl sm:text-3xl text-slate-400 font-normal">C</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                  <p>{t.metric_feels_like} <strong className="text-slate-800 dark:text-slate-200">{Math.round(curr.feels_like)}°C</strong></p>
                  {daily[0] && (
                    <p>{t.metric_high} <strong className="text-slate-800 dark:text-slate-200">{Math.round(daily[0].temp_max)}°</strong> • {t.metric_low} <strong className="text-slate-800 dark:text-slate-200">{Math.round(daily[0].temp_min)}°</strong></p>
                  )}
                </div>
              </div>
            </div>

            {/* Meteorological Parameters Grid (8 Standard Parameters) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/80 shadow-xs flex items-center gap-2.5 min-w-0 glass-card-hover hover:bg-sky-50/50 dark:hover:bg-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-normal break-words leading-tight">{t.metric_humidity}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white whitespace-normal break-words leading-tight">{curr.humidity}%</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/80 shadow-xs flex items-center gap-2.5 min-w-0 glass-card-hover hover:bg-sky-50/50 dark:hover:bg-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-normal break-words leading-tight">{t.metric_wind}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white whitespace-normal break-words leading-tight">{curr.wind_speed} km/h</p>
                </div>
              </div>



              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/80 shadow-xs flex items-center gap-2.5 min-w-0 glass-card-hover hover:bg-sky-50/50 dark:hover:bg-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-normal break-words leading-tight">{t.metric_uv}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white whitespace-normal break-words leading-tight">{curr.uv_index}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/80 shadow-xs flex items-center gap-2.5 min-w-0 glass-card-hover hover:bg-sky-50/50 dark:hover:bg-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-normal break-words leading-tight">{t.metric_rain}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white whitespace-normal break-words leading-tight">{curr.precipitation_probability}%</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/80 shadow-xs flex items-center gap-2.5 min-w-0 glass-card-hover hover:bg-sky-50/50 dark:hover:bg-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-yellow-50 dark:bg-yellow-950/60 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shrink-0">
                  <Sunrise className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{t.metric_sunrise}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{curr.sunrise}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/80 shadow-xs flex items-center gap-2.5 min-w-0 glass-card-hover hover:bg-sky-50/50 dark:hover:bg-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                  <Sunset className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{t.metric_sunset}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{curr.sunset}</p>
                </div>
              </div>

            </div>

          </div>

          {/* 8. Hourly Forecast Rail */}
          <div id="hourly" className="rounded-2xl glass-panel p-4 sm:p-6 space-y-3 shadow-sm border border-sky-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                {t.forecast_24h_title}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">{t.forecast_hourly_res}</span>
            </div>

            <div className="w-full overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex items-center gap-2 min-w-[620px]">
                {hourly.slice(0, 16).map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-[60px] p-2.5 rounded-xl text-center bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/80 shadow-xs space-y-1"
                  >
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {h.time.split('T').pop()?.slice(0, 5) || `${h.hour}:00`}
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {Math.round(h.temperature)}°
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${h.precipitation_probability > 40 ? 'bg-sky-500 dark:bg-sky-400' : 'bg-slate-300 dark:bg-slate-600'}`}
                        style={{ width: `${h.precipitation_probability}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                      {h.precipitation_probability}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 9. 7-Day Weather Outlook */}
          <div id="daily" className="rounded-2xl glass-panel p-4 sm:p-6 space-y-3 shadow-sm border border-sky-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              {t.forecast_7d_title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {daily.map((d, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/80 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{getLocalizedWeekday(d.day_name, language)}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[110px]">{getLocalizedWeatherCondition(d.condition_text, language)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {Math.round(d.temp_max)}° <span className="text-slate-400 dark:text-slate-500 font-normal">/ {Math.round(d.temp_min)}°</span>
                    </p>
                    <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
                      {d.precipitation_probability}% {t.forecast_rain_suffix}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Krishi Intelligence Advisory */}
          {intelligence && context && (
            <div id="krishi">
              <KrishiIntelligenceCard
                weather={weather}
                intelligence={intelligence}
                context={context}
              />
            </div>
          )}
        </div>

      </div>

      {/* 11. Crop Prediction Module */}
      <CropPredictionCard />

    </div>
  );
};
