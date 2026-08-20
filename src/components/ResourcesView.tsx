import React, { useState } from 'react';
import { Library, ExternalLink, Search, PlayCircle, BookOpen, Layers } from 'lucide-react';
import { ResourceItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ResourcesViewProps {
  resources: ResourceItem[];
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ resources }) => {
  const { currentTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter((res) => {
    const matchesCat = selectedCategory === 'All' || res.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQ =
      !q ||
      res.title.toLowerCase().includes(q) ||
      res.channelOrAuthor.toLowerCase().includes(q) ||
      res.description.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8" style={{ color: currentTheme.vars['--text-main'] }}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
          <Library className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
          <span>Curated Video & Documentation Vault</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.vars['--text-main'] }}>
          High-Quality Learning Resources
        </h2>
        <p className="text-xs opacity-80 mt-1" style={{ color: currentTheme.vars['--text-muted'] }}>
          Strictly selected for teaching clarity, technical accuracy, and immediate practical application.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3" style={{ color: currentTheme.vars['--text-muted'] }} />
          <input
            type="text"
            placeholder="Search channels (freeCodeCamp, Fireship, Net Ninja)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
            style={{
              backgroundColor: currentTheme.vars['--card-inner-bg'],
              borderColor: currentTheme.vars['--card-inner-border'],
              color: currentTheme.vars['--text-main'],
            }}
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2">
          {['All', 'Full-Stack', 'AI Engineering', 'DSA'].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                style={{
                  backgroundColor: isSelected ? currentTheme.vars['--primary'] : currentTheme.vars['--card-bg'],
                  color: isSelected ? '#FFFFFF' : currentTheme.vars['--text-muted'],
                  borderColor: isSelected ? currentTheme.vars['--primary'] : currentTheme.vars['--card-border'],
                  borderWidth: '1px',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-3xl border shadow-md space-y-3 transition-all flex flex-col justify-between"
            style={{
              backgroundColor: currentTheme.vars['--card-bg'],
              borderColor: currentTheme.vars['--card-border'],
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="uppercase tracking-wider" style={{ color: currentTheme.vars['--text-accent'] }}>
                  {res.category}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full border text-[10px]"
                  style={{
                    backgroundColor: currentTheme.badgeBg,
                    color: currentTheme.badgeText,
                    borderColor: currentTheme.vars['--card-inner-border'],
                  }}
                >
                  {res.level}
                </span>
              </div>

              <h3 className="font-bold text-sm leading-snug" style={{ color: currentTheme.vars['--text-main'] }}>
                {res.title}
              </h3>

              <p className="text-xs font-medium" style={{ color: currentTheme.vars['--text-muted'] }}>
                Author/Channel: <span className="font-semibold" style={{ color: currentTheme.vars['--text-main'] }}>{res.channelOrAuthor}</span>
              </p>

              <p className="text-xs leading-relaxed opacity-90" style={{ color: currentTheme.vars['--text-muted'] }}>
                {res.description}
              </p>
            </div>

            <div
              className="pt-3 border-t flex items-center justify-between"
              style={{ borderColor: currentTheme.vars['--card-inner-border'] }}
            >
              <span
                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: currentTheme.vars['--card-inner-bg'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                  color: currentTheme.vars['--text-muted'],
                }}
              >
                {res.type}
              </span>

              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
                style={{ color: currentTheme.vars['--text-accent'] }}
              >
                <span>Open Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
