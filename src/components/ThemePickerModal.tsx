import React, { useState } from 'react';
import { useTheme, THEMES, ThemeId, ColorFamily, ThemeDefinition, FontStyle, FontSize } from '../context/ThemeContext';
import { Palette, Check, X, Sparkles, SlidersHorizontal, Info, Eye, Sun, Moon, Type } from 'lucide-react';

export const ThemePickerModal: React.FC = () => {
  const {
    currentTheme,
    setThemeId,
    isPickerOpen,
    setIsPickerOpen,
    fontStyle,
    setFontStyle,
    fontSize,
    setFontSize,
    fontStyles,
    fontSizes,
  } = useTheme();

  const [selectedFamily, setSelectedFamily] = useState<ColorFamily | 'all'>('all');
  const [shadeFilter, setShadeFilter] = useState<'all' | 'white' | 'dark'>('all');
  const [hoveredTheme, setHoveredTheme] = useState<ThemeDefinition | null>(null);

  if (!isPickerOpen) return null;

  const colorFamilies: { id: ColorFamily | 'all'; label: string; icon: string; hex: string }[] = [
    { id: 'all', label: 'All 9 Color Families', icon: '🎨', hex: '#E6007A' },
    { id: 'pink', label: 'Pink', icon: '🩷', hex: '#E6007A' },
    { id: 'green', label: 'Green', icon: '💚', hex: '#10B981' },
    { id: 'yellow', label: 'Yellow', icon: '💛', hex: '#EAB308' },
    { id: 'red', label: 'Red', icon: '❤️', hex: '#EF4444' },
    { id: 'blue', label: 'Blue', icon: '💙', hex: '#2563EB' },
    { id: 'purple', label: 'Purple', icon: '💜', hex: '#9333EA' },
    { id: 'brown', label: 'Brown', icon: '🤎', hex: '#B45309' },
    { id: 'grey', label: 'Grey', icon: '🩶', hex: '#71717A' },
    { id: 'orange', label: 'Orange', icon: '🧡', hex: '#F97316' },
  ];

  const displayTheme = hoveredTheme || currentTheme;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none overflow-y-auto">
      <div
        className="border rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl relative overflow-hidden space-y-5 my-auto max-h-[92vh] flex flex-col justify-between transition-colors duration-300"
        style={{
          backgroundColor: currentTheme.vars['--card-bg'],
          borderColor: currentTheme.vars['--card-border'],
          color: currentTheme.vars['--text-main'],
        }}
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: currentTheme.vars['--card-inner-border'] }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md text-white shrink-0"
              style={{
                background: `linear-gradient(to top right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
              }}
            >
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 flex-wrap" style={{ color: currentTheme.vars['--text-main'] }}>
                <span>RGB Color Grid & Theme Inspector</span>
                <span
                  className="text-[10px] px-2.5 py-0.5 rounded-full font-bold border"
                  style={{
                    backgroundColor: currentTheme.badgeBg,
                    color: currentTheme.badgeText,
                    borderColor: currentTheme.vars['--card-inner-border'],
                  }}
                >
                  63 Themes (7 Shades × 9 Families)
                </span>
              </h2>
              <p className="text-xs opacity-80 mt-0.5" style={{ color: currentTheme.vars['--text-muted'] }}>
                From Crisp White & Soft Pastels to Midnight Obsidian and Electric Neon.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPickerOpen(false)}
            className="p-2 rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer self-end sm:self-center"
            style={{
              backgroundColor: currentTheme.vars['--card-inner-bg'],
              borderColor: currentTheme.vars['--card-inner-border'],
              color: currentTheme.vars['--text-main'],
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Typography: Font Style & Font Size Controls Card */}
        <div
          className="p-3.5 rounded-2xl border space-y-3"
          style={{
            backgroundColor: currentTheme.vars['--card-inner-bg'],
            borderColor: currentTheme.vars['--card-inner-border'],
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Font Family Selection */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: currentTheme.vars['--text-main'] }}>
                <Type className="w-4 h-4" style={{ color: currentTheme.vars['--primary'] }} />
                <span>Font Style (Typeface):</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {fontStyles.map((f) => {
                  const isSelected = fontStyle === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFontStyle(f.id)}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer hover:scale-105 active:scale-95"
                      style={{
                        fontFamily: f.fontFamily,
                        backgroundColor: isSelected ? currentTheme.vars['--primary'] : currentTheme.vars['--card-bg'],
                        color: isSelected ? '#FFFFFF' : currentTheme.vars['--text-main'],
                        borderColor: isSelected ? currentTheme.vars['--primary'] : currentTheme.vars['--card-border'],
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Size Selection */}
            <div className="space-y-1.5 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: currentTheme.vars['--text-main'] }}>
                <span className="text-sm font-serif">A</span>
                <span className="text-xs font-serif font-bold">A</span>
                <span>Font Size (Base):</span>
              </div>
              <div className="flex items-center gap-1.5">
                {fontSizes.map((s) => {
                  const isSelected = fontSize === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFontSize(s.id)}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: isSelected ? currentTheme.vars['--primary'] : currentTheme.vars['--card-bg'],
                        color: isSelected ? '#FFFFFF' : currentTheme.vars['--text-main'],
                        borderColor: isSelected ? currentTheme.vars['--primary'] : currentTheme.vars['--card-border'],
                      }}
                    >
                      <span>{s.label}</span>
                      <span className="text-[10px] opacity-75">({s.scale})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Row: Shade Canvas Filter + Family Pills */}
        <div className="space-y-2.5">
          {/* Canvas Mode Quick Filter: All vs Light/White vs Dark */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1" style={{ color: currentTheme.vars['--text-muted'] }}>
              <SlidersHorizontal className="w-3.5 h-3.5" /> Canvas Filter:
            </span>
            <button
              onClick={() => setShadeFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                shadeFilter === 'all' ? 'shadow-md scale-105' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: shadeFilter === 'all' ? currentTheme.vars['--primary'] : currentTheme.vars['--card-inner-bg'],
                color: shadeFilter === 'all' ? '#FFFFFF' : currentTheme.vars['--text-main'],
                borderColor: shadeFilter === 'all' ? currentTheme.vars['--primary'] : currentTheme.vars['--card-inner-border'],
              }}
            >
              All 63 Themes
            </button>
            <button
              onClick={() => setShadeFilter('white')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center gap-1 ${
                shadeFilter === 'white' ? 'shadow-md scale-105' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: shadeFilter === 'white' ? '#FFFFFF' : currentTheme.vars['--card-inner-bg'],
                color: shadeFilter === 'white' ? '#0F172A' : currentTheme.vars['--text-main'],
                borderColor: shadeFilter === 'white' ? '#E2E8F0' : currentTheme.vars['--card-inner-border'],
              }}
            >
              <Sun className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>Light & Soft Canvas (18)</span>
            </button>
            <button
              onClick={() => setShadeFilter('dark')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center gap-1 ${
                shadeFilter === 'dark' ? 'shadow-md scale-105' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: shadeFilter === 'dark' ? '#18181B' : currentTheme.vars['--card-inner-bg'],
                color: shadeFilter === 'dark' ? '#FFFFFF' : currentTheme.vars['--text-main'],
                borderColor: shadeFilter === 'dark' ? '#3F3F46' : currentTheme.vars['--card-inner-border'],
              }}
            >
              <Moon className="w-3 h-3 text-indigo-400 fill-indigo-400" />
              <span>Dark & Obsidian Canvas (45)</span>
            </button>
          </div>

          {/* Color Family Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {colorFamilies.map((fam) => {
              const isActive = selectedFamily === fam.id;
              return (
                <button
                  key={fam.id}
                  onClick={() => setSelectedFamily(fam.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border"
                  style={{
                    backgroundColor: isActive ? currentTheme.vars['--primary'] : currentTheme.vars['--card-inner-bg'],
                    color: isActive ? '#FFFFFF' : currentTheme.vars['--text-muted'],
                    borderColor: isActive ? currentTheme.vars['--primary'] : currentTheme.vars['--card-inner-border'],
                  }}
                >
                  <span>{fam.icon}</span>
                  <span>{fam.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN BODY: Grid of Color Swatches + Hover Inspector Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-1 max-h-[55vh]">
          {/* LEFT 8 COLS: Swatches Grid arranged by Family & Shade */}
          <div className="lg:col-span-8 space-y-5">
            {colorFamilies
              .filter((f) => f.id !== 'all' && (selectedFamily === 'all' || selectedFamily === f.id))
              .map((fam) => {
                let familyThemes = THEMES.filter((t) => t.family === fam.id);
                if (shadeFilter === 'white') {
                  familyThemes = familyThemes.filter((t) => t.shade === 'white' || t.shade === 'soft');
                } else if (shadeFilter === 'dark') {
                  familyThemes = familyThemes.filter((t) => t.shade !== 'white' && t.shade !== 'soft');
                }

                if (familyThemes.length === 0) return null;

                return (
                  <div
                    key={fam.id}
                    className="p-4 rounded-2xl border space-y-3"
                    style={{
                      backgroundColor: currentTheme.vars['--card-inner-bg'],
                      borderColor: currentTheme.vars['--card-inner-border'],
                    }}
                  >
                    <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: currentTheme.vars['--card-border'] }}>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{fam.icon}</span>
                        <span className="font-bold text-xs uppercase tracking-wider" style={{ color: currentTheme.vars['--text-main'] }}>
                          {fam.label} Family
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold opacity-70 hidden sm:inline" style={{ color: currentTheme.vars['--text-muted'] }}>
                        White • Soft • Light • Medium • Dark • Deep • Electric
                      </span>
                    </div>

                    {/* Shade Swatches Row (7 swatches per family) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {familyThemes.map((t) => {
                        const isSelected = currentTheme.id === t.id;
                        const isHovered = hoveredTheme?.id === t.id;
                        const isWhiteCanvas = t.shade === 'white';

                        return (
                          <button
                            key={t.id}
                            onClick={() => setThemeId(t.id as ThemeId)}
                            onMouseEnter={() => setHoveredTheme(t)}
                            onMouseLeave={() => setHoveredTheme(null)}
                            className={`p-2.5 rounded-2xl border text-left transition-all duration-150 relative flex flex-col justify-between space-y-2 cursor-pointer group ${
                              isSelected
                                ? 'ring-2 ring-emerald-400 scale-[1.03] shadow-lg z-10'
                                : 'hover:scale-[1.02] hover:z-10'
                            }`}
                            style={{
                              backgroundColor: t.vars['--card-bg'],
                              borderColor: isSelected
                                ? t.vars['--primary']
                                : isHovered
                                ? t.vars['--primary']
                                : t.vars['--card-border'],
                            }}
                          >
                            {/* Selected Check Indicator */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-400 text-black flex items-center justify-center text-[10px] shadow-sm font-bold">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}

                            {/* White Canvas Indicator Badge */}
                            {isWhiteCanvas && (
                              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-[9px] shadow-xs font-bold" title="Crisp White Canvas Theme">
                                <Sun className="w-2.5 h-2.5 fill-slate-900" />
                              </div>
                            )}

                            {/* Color Bar / Swatch Matrix Pill */}
                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-5 h-5 rounded-lg border border-black/10 shadow-xs shrink-0 flex items-center justify-center"
                                style={{ backgroundColor: t.previewColor }}
                              >
                                <Sparkles className="w-2.5 h-2.5 text-white/90" />
                              </div>

                              <div className="flex items-center gap-1">
                                <div className="w-2.5 h-2.5 rounded-sm border border-black/10" style={{ backgroundColor: t.badgeBg }} />
                                <div className="w-2.5 h-2.5 rounded-sm border border-black/10" style={{ backgroundColor: t.vars['--secondary-bg'] }} />
                              </div>
                            </div>

                            {/* Title & Shade Level */}
                            <div>
                              <div className="font-bold text-[10px] truncate" style={{ color: t.vars['--text-main'] }}>
                                {t.name.split('(')[0].trim()}
                              </div>
                              <div className="font-mono text-[9px] uppercase font-semibold flex items-center justify-between" style={{ color: t.vars['--text-muted'] }}>
                                <span>{t.shade}</span>
                                <span className="opacity-75">{t.hex}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* RIGHT 4 COLS: RGB Inspector & Live UI Preview Card */}
          <div className="lg:col-span-4 space-y-4">
            <div
              className="p-5 rounded-3xl border shadow-xl space-y-4 sticky top-0"
              style={{
                backgroundColor: displayTheme.vars['--card-bg'],
                borderColor: displayTheme.vars['--card-border'],
                color: displayTheme.vars['--text-main'],
              }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: displayTheme.vars['--card-inner-border'] }}>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" style={{ color: displayTheme.vars['--text-accent'] }} />
                  <span className="font-bold text-xs uppercase tracking-wider">
                    {hoveredTheme ? 'Hovered Swatch Details' : 'Active Theme Inspector'}
                  </span>
                </div>
                {hoveredTheme && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Live Previewing
                  </span>
                )}
              </div>

              {/* Swatch Title & Color Circle */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl border-2 shadow-md shrink-0 flex items-center justify-center"
                  style={{
                    backgroundColor: displayTheme.previewColor,
                    borderColor: displayTheme.vars['--text-main'],
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white drop-shadow-md" />
                </div>

                <div>
                  <h4 className="font-bold text-sm tracking-tight">{displayTheme.name}</h4>
                  <p className="text-xs opacity-80 capitalize" style={{ color: displayTheme.vars['--text-muted'] }}>
                    Family: <span className="font-bold uppercase">{displayTheme.family}</span> • Level: <span className="font-bold uppercase">{displayTheme.shade}</span>
                  </p>
                </div>
              </div>

              {/* RGB breakdown table */}
              <div
                className="p-3.5 rounded-2xl border font-mono text-xs space-y-2"
                style={{
                  backgroundColor: displayTheme.vars['--card-inner-bg'],
                  borderColor: displayTheme.vars['--card-inner-border'],
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-[11px]" style={{ color: displayTheme.vars['--text-muted'] }}>RGB Value:</span>
                  <span className="font-bold text-xs" style={{ color: displayTheme.vars['--text-accent'] }}>{displayTheme.rgb}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-[11px]" style={{ color: displayTheme.vars['--text-muted'] }}>HEX Code:</span>
                  <span className="font-bold text-xs">{displayTheme.hex}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-[11px]" style={{ color: displayTheme.vars['--text-muted'] }}>Primary Accent:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: displayTheme.vars['--primary'] }} />
                    <span>{displayTheme.vars['--primary']}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: displayTheme.vars['--card-inner-border'] }}>
                  <span className="opacity-70 text-[11px]" style={{ color: displayTheme.vars['--text-muted'] }}>Canvas Background:</span>
                  <span className="font-bold text-xs">{displayTheme.vars['--app-bg-from']}</span>
                </div>
              </div>

              {/* Live UI Mock Components */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-80" style={{ color: displayTheme.vars['--text-muted'] }}>
                  Simulated UI Component Preview:
                </span>

                <div
                  className="p-3 rounded-2xl border space-y-2.5 text-xs"
                  style={{
                    backgroundColor: displayTheme.vars['--card-inner-bg'],
                    borderColor: displayTheme.vars['--card-inner-border'],
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Sample Task Card</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: displayTheme.badgeBg,
                        color: displayTheme.badgeText,
                        borderColor: displayTheme.vars['--card-inner-border'],
                      }}
                    >
                      Active
                    </span>
                  </div>

                  <button
                    className="w-full py-2 rounded-xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${displayTheme.vars['--primary-gradient-from']}, ${displayTheme.vars['--primary-gradient-to']})`,
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Primary Action Button</span>
                  </button>
                </div>
              </div>

              {/* Click instruction */}
              <button
                onClick={() => setThemeId(displayTheme.id)}
                className="w-full py-2.5 rounded-2xl text-white font-bold text-xs shadow-lg transition-all border flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: displayTheme.vars['--primary'],
                  borderColor: displayTheme.vars['--card-border'],
                }}
              >
                <Check className="w-4 h-4" />
                <span>Apply &quot;{displayTheme.name}&quot; App-Wide</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderColor: currentTheme.vars['--card-inner-border'] }}>
          <div className="flex items-center gap-2">
            <span className="opacity-80" style={{ color: currentTheme.vars['--text-muted'] }}>Active App Palette:</span>
            <span
              className="px-3 py-1 rounded-full font-bold text-xs border flex items-center gap-1.5"
              style={{
                backgroundColor: currentTheme.vars['--card-bg'],
                color: currentTheme.vars['--text-main'],
                borderColor: currentTheme.vars['--primary'],
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentTheme.previewColor }} />
              <span>{currentTheme.name} ({currentTheme.rgb})</span>
            </span>
          </div>

          <button
            onClick={() => setIsPickerOpen(false)}
            className="px-6 py-2 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(to right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
            }}
          >
            Done & Close
          </button>
        </div>
      </div>
    </div>
  );
};
