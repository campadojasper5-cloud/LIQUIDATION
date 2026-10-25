import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Palette,
  Sparkles,
  ShieldCheck,
  Building,
  RotateCcw,
  Sliders,
  Award,
  Sun,
  Moon,
} from 'lucide-react';
import { SchoolProfile } from '../types';

export type BackgroundTheme = 'emerald' | 'slate' | 'sapphire' | 'parchment' | 'cyber' | 'custom';

interface ThemeAndLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolProfile;
  currentTheme: BackgroundTheme;
  customBgUrl: string;
  bgOpacity: number;
  onUpdateSchool: (updated: SchoolProfile) => void;
  onSelectTheme: (theme: BackgroundTheme) => void;
  onUpdateCustomBg: (url: string) => void;
  onUpdateBgOpacity: (opacity: number) => void;
}

const PRESET_LOGOS = [
  {
    name: 'DepEd Official Seal',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23047857" stroke="%23f59e0b" stroke-width="4"/><circle cx="50" cy="50" r="38" fill="%23ffffff"/><path d="M50 20 L58 36 L76 39 L63 51 L66 69 L50 60 L34 69 L37 51 L24 39 L42 36 Z" fill="%23f59e0b"/><text x="50" y="82" font-size="11" font-weight="bold" fill="%23065f46" text-anchor="middle" font-family="sans-serif">DEPED</text></svg>',
  },
  {
    name: 'Bagong Pilipinas Seal',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%231e3a8a" stroke="%23ef4444" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="%23ffffff"/><circle cx="50" cy="50" r="16" fill="%23f59e0b"/><path d="M50 24 L53 38 L67 41 L56 50 L59 64 L50 56 L41 64 L44 50 L33 41 L47 38 Z" fill="%231e3a8a"/><text x="50" y="82" font-size="9" font-weight="bold" fill="%231e3a8a" text-anchor="middle" font-family="sans-serif">PILIPINAS</text></svg>',
  },
  {
    name: 'Eagle Academic Crest',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,4 92,25 92,75 50,96 8,75 8,25" fill="%230f172a" stroke="%2338bdf8" stroke-width="3"/><circle cx="50" cy="50" r="28" fill="%230284c7"/><text x="50" y="55" font-size="20" font-weight="bold" fill="%23ffffff" text-anchor="middle" font-family="sans-serif">MHS</text><text x="50" y="80" font-size="8" font-weight="bold" fill="%2394a3b8" text-anchor="middle" font-family="sans-serif">EXCELLENCE</text></svg>',
  },
  {
    name: 'Golden Wisdom Torch',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%2378350f" stroke="%23d97706" stroke-width="4"/><circle cx="50" cy="50" r="36" fill="%23fef3c7"/><path d="M50 22 C55 35 62 42 60 52 C58 60 52 65 50 68 C48 65 42 60 40 52 C38 42 45 35 50 22 Z" fill="%23dc2626"/><rect x="46" y="66" width="8" height="18" fill="%23d97706" rx="2"/></svg>',
  },
];

export const ThemeAndLogoModal: React.FC<ThemeAndLogoModalProps> = ({
  isOpen,
  onClose,
  school,
  currentTheme,
  customBgUrl,
  bgOpacity,
  onUpdateSchool,
  onSelectTheme,
  onUpdateCustomBg,
  onUpdateBgOpacity,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'logo' | 'theme' | 'wallpaper'>('logo');
  const [logoPreview, setLogoPreview] = useState<string>(school.logoUrl || PRESET_LOGOS[0].url);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        onUpdateSchool({ ...school, logoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onUpdateCustomBg(result);
        onSelectTheme('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetLogo = (url: string) => {
    setLogoPreview(url);
    onUpdateSchool({ ...school, logoUrl: url });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                School Branding &amp; Visual Appearance
              </h2>
              <p className="text-xs text-slate-500">
                Upload official school logo, personalize background themes, and adjust UI smoothness
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('logo')}
            className={`cursor-pointer py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'logo'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            School Logo &amp; Seal
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`cursor-pointer py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'theme'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Color Palette &amp; Theme
          </button>
          <button
            onClick={() => setActiveTab('wallpaper')}
            className={`cursor-pointer py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'wallpaper'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Custom School Wallpaper
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* TAB 1: School Logo Upload */}
          {activeTab === 'logo' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                {/* Current Logo Preview */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={logoPreview}
                      alt="School Logo Preview"
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    ✓
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {school.schoolName} Official Seal
                    </h3>
                    <p className="text-xs text-slate-500">
                      This logo will automatically appear on all official GAM Appendices, Liquidation Reports, and Pre-Audit Certificates.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start pt-1">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Custom School Logo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectPresetLogo(PRESET_LOGOS[0].url)}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset to DepEd Seal</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Preset Logos */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Or Select Official Government &amp; Institutional Preset Seals:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_LOGOS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPresetLogo(preset.url)}
                      className={`cursor-pointer p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                        logoPreview === preset.url
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden p-1 bg-white shadow-2xs border border-slate-100 flex items-center justify-center">
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-800 leading-tight">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Theme Presets */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700">
                Choose Institutional UI Theme &amp; Backdrop:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Emerald */}
                <button
                  type="button"
                  onClick={() => onSelectTheme('emerald')}
                  className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                    currentTheme === 'emerald'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-700 shadow-xs" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">DepEd Emerald Classic</div>
                      <div className="text-[10px] text-slate-500">Government prestige with emerald tones</div>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-linear-to-r from-emerald-600 via-emerald-400 to-amber-400 w-full" />
                </button>

                {/* Slate */}
                <button
                  type="button"
                  onClick={() => onSelectTheme('slate')}
                  className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                    currentTheme === 'slate'
                      ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-400/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 shadow-xs" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Corporate Slate Minimal</div>
                      <div className="text-[10px] text-slate-500">High contrast modern neutral aesthetics</div>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-linear-to-r from-slate-900 via-slate-600 to-slate-300 w-full" />
                </button>

                {/* Sapphire */}
                <button
                  type="button"
                  onClick={() => onSelectTheme('sapphire')}
                  className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                    currentTheme === 'sapphire'
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-700 shadow-xs" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Maritime Sapphire Navy</div>
                      <div className="text-[10px] text-slate-500">Executive collegiate blue &amp; cyan aura</div>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-linear-to-r from-blue-900 via-blue-600 to-cyan-400 w-full" />
                </button>

                {/* Parchment */}
                <button
                  type="button"
                  onClick={() => onSelectTheme('parchment')}
                  className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                    currentTheme === 'parchment'
                      ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-amber-700 shadow-xs" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">GAM Ivory Document</div>
                      <div className="text-[10px] text-slate-500">Warm archival paper with quiet typography</div>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-linear-to-r from-amber-700 via-amber-400 to-stone-200 w-full" />
                </button>

                {/* Cyber Dark */}
                <button
                  type="button"
                  onClick={() => onSelectTheme('cyber')}
                  className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                    currentTheme === 'cyber'
                      ? 'border-emerald-500 bg-slate-900 ring-2 ring-emerald-500/30 shadow-xs'
                      : 'border-slate-800 bg-slate-950 text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 shadow-xs" />
                    <div>
                      <div className="text-xs font-bold text-white">Midnight Cyber Audit</div>
                      <div className="text-[10px] text-slate-400">Deep sleek dark mode with neon accents</div>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-linear-to-r from-emerald-500 via-teal-400 to-cyan-500 w-full" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Custom Wallpaper Upload */}
          {activeTab === 'wallpaper' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Custom School Campus Wallpaper
                </h3>
                <p className="text-xs text-slate-500">
                  Upload a photo of your school building, faculty quadrangle, or graduation grounds as a subtle background.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    ref={bgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBgUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bgInputRef.current?.click()}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Campus Photo</span>
                  </button>

                  {customBgUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateCustomBg('');
                        onSelectTheme('emerald');
                      }}
                      className="cursor-pointer text-xs text-red-600 hover:text-red-700 underline font-medium"
                    >
                      Remove Wallpaper
                    </button>
                  )}
                </div>

                {customBgUrl && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                      <span>Wallpaper Ambient Opacity:</span>
                      <span className="font-mono font-bold text-emerald-700">{Math.round(bgOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.4"
                      step="0.02"
                      value={bgOpacity}
                      onChange={(e) => onUpdateBgOpacity(parseFloat(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-500 block">
                      Controls the subtle visibility of your campus photo beneath the accounting tables and cards.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Jasper S. Campado System Developer Credit */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                JC
              </div>
              <div>
                <div className="font-bold text-slate-100 flex items-center gap-1.5">
                  <span>JASPER S. CAMPADO</span>
                  <span className="px-1.5 py-0.2 bg-emerald-800 text-emerald-200 rounded text-[9px]">Admin Officer II</span>
                </div>
                <div className="text-[11px] text-emerald-400">
                  Lead System Developer &amp; DepEd MOOE Software Architect
                </div>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              v2.4.0 High-Fidelity
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            Apply &amp; Save Branding
          </button>
        </div>
      </div>
    </div>
  );
};
