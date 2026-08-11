import React from 'react';
import { Music, Search, Upload, Wand2 } from 'lucide-react';

interface HeaderProps {
  onUploadClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onUploadClick }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-400/20 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-orange-400 shadow-lg shadow-fuchsia-500/30">
              <Music className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.45em] text-cyan-200">
                <Wand2 className="h-3.5 w-3.5" /> Studio
              </p>
              <h1 className="bg-gradient-to-r from-cyan-200 via-white to-fuchsia-300 bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-3xl">
                Z3RO MUSIC EDITOR
              </h1>
            </div>
          </div>

          <div className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-200/70" />
              <input
                type="text"
                placeholder="Search tracks, edits, stems..."
                className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder-gray-400 outline-none transition-all duration-200 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>
          </div>

          <button
            onClick={onUploadClick}
            className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 px-5 py-3 font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:scale-105 hover:from-cyan-400 hover:to-fuchsia-500"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import Audio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
