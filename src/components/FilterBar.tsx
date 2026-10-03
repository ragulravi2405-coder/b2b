import React from 'react';
import { Search, SlidersHorizontal, HelpCircle, Navigation2, X } from 'lucide-react';

interface FilterBarProps {
  orientation: string;
  onSelectOrientation: (val: string) => void;
  maxDistance?: number;
  onSelectMaxDistance: (dist: number | undefined) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenIdentityModal: () => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  orientation,
  onSelectOrientation,
  maxDistance,
  onSelectMaxDistance,
  searchQuery,
  onSearchChange,
  onOpenIdentityModal,
  totalCount
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, interest (e.g. Music, Travel, Art)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-2xl border border-slate-200/80 focus:outline-none focus:border-[#6C3BFF] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Model Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 self-start md:self-auto">
          {['All', 'Male Models', 'Fitness'].map((tab) => (
            <button
              key={tab}
              onClick={() => onSelectOrientation(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                orientation === tab
                  ? 'bg-white text-[#6C3BFF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Second row: Distance presets & Educational link */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Navigation2 className="w-3 h-3 text-[#00C496]" />
            Distance:
          </span>

          {[
            { label: 'Any', value: undefined },
            { label: '< 10 km', value: 10 },
            { label: '< 20 km', value: 20 },
            { label: '< 30 km', value: 30 },
            { label: '< 50 km', value: 50 }
          ].map((d) => (
            <button
              key={d.label}
              onClick={() => onSelectMaxDistance(d.value)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                maxDistance === d.value
                  ? 'bg-[#6C3BFF] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium">
            Showing <strong className="text-slate-700">{totalCount}</strong> profiles
          </span>
        </div>
      </div>
    </div>
  );
};
