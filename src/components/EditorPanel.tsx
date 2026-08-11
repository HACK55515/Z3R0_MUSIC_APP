import React from 'react';
import { Download, Gauge, Scissors, Sparkles, Volume2, Waves } from 'lucide-react';
import { EditorSettings, Track } from '../types/music';

interface EditorPanelProps {
  track: Track | null;
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const EditorPanel: React.FC<EditorPanelProps> = ({ track, settings, onSettingsChange }) => {
  const duration = track?.duration || 0;
  const trimEnd = settings.trimEnd || duration;

  const updateSetting = (key: keyof EditorSettings, value: number) => {
    const next = { ...settings, [key]: value };

    if (key === 'trimStart') {
      next.trimStart = clamp(value, 0, Math.max(0, trimEnd - 1));
    }

    if (key === 'trimEnd') {
      next.trimEnd = clamp(value, Math.min(duration, settings.trimStart + 1), duration);
    }

    onSettingsChange(next);
  };

  const exportEdit = () => {
    if (!track) return;

    const editManifest = {
      project: 'Z3RO MUSIC EDITOR',
      source: track.title,
      artist: track.artist,
      exportedAt: new Date().toISOString(),
      settings: { ...settings, trimEnd },
    };

    const blob = new Blob([JSON.stringify(editManifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${track.title.replace(/\s+/g, '-').toLowerCase()}-z3ro-edit.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.35em] text-cyan-200">
            <Sparkles className="h-4 w-4" /> Live edit rack
          </p>
          <h2 className="text-3xl font-black text-white">Shape, trim, and prep your next drop.</h2>
          <p className="mt-2 max-w-2xl text-gray-300">
            Select a track to audition editor settings. Export saves a portable Z3RO edit manifest with your gain, fade, speed, and trim choices.
          </p>
        </div>
        <button
          onClick={exportEdit}
          disabled={!track}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-black text-gray-950 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-4 w-4" /> Export edit
        </button>
      </div>

      <div className="mb-6 overflow-hidden rounded-3xl border border-cyan-300/20 bg-black/40 p-5">
        <div className="mb-4 flex items-center justify-between text-sm text-gray-300">
          <span className="font-semibold text-white">{track ? `${track.title} waveform` : 'Waiting for audio'}</span>
          <span>{track ? `${Math.round(settings.trimStart)}s - ${Math.round(trimEnd)}s` : 'Import a track to begin'}</span>
        </div>
        <div className="flex h-28 items-center gap-1">
          {Array.from({ length: 64 }).map((_, index) => {
            const height = 24 + Math.abs(Math.sin(index * 0.55)) * 70 + (index % 7) * 2;
            const progress = duration ? (index / 63) * duration : 0;
            const active = track && progress >= settings.trimStart && progress <= trimEnd;
            return (
              <div
                key={index}
                className={`flex-1 rounded-full transition ${active ? 'bg-gradient-to-t from-cyan-400 to-fuchsia-400' : 'bg-white/10'}`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Control icon={<Volume2 />} label="Gain" value={settings.gain} min={0.2} max={2} step={0.1} suffix="x" onChange={value => updateSetting('gain', value)} />
        <Control icon={<Gauge />} label="Speed" value={settings.playbackRate} min={0.5} max={1.5} step={0.05} suffix="x" onChange={value => updateSetting('playbackRate', value)} />
        <Control icon={<Waves />} label="Fade in" value={settings.fadeIn} min={0} max={15} step={0.5} suffix="s" onChange={value => updateSetting('fadeIn', value)} />
        <Control icon={<Waves />} label="Fade out" value={settings.fadeOut} min={0} max={15} step={0.5} suffix="s" onChange={value => updateSetting('fadeOut', value)} />
        <Control disabled={!track} icon={<Scissors />} label="Trim start" value={settings.trimStart} min={0} max={duration} step={0.5} suffix="s" onChange={value => updateSetting('trimStart', value)} />
        <Control disabled={!track} icon={<Scissors />} label="Trim end" value={trimEnd} min={0} max={duration} step={0.5} suffix="s" onChange={value => updateSetting('trimEnd', value)} />
      </div>
    </section>
  );
};

interface ControlProps {
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  suffix: string;
  value: number;
}

const Control: React.FC<ControlProps> = ({ disabled, icon, label, max, min, onChange, step, suffix, value }) => (
  <label className="rounded-2xl border border-white/10 bg-black/30 p-4">
    <div className="mb-3 flex items-center justify-between text-sm font-bold text-white">
      <span className="flex items-center gap-2 text-cyan-100">{React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })}{label}</span>
      <span>{value.toFixed(step < 0.1 ? 2 : 1)}{suffix}</span>
    </div>
    <input disabled={disabled} type="range" min={min} max={max || 1} step={step} value={value} onChange={event => onChange(Number(event.target.value))} className="w-full accent-cyan-300 disabled:opacity-30" />
  </label>
);
