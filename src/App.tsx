import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadModal } from './components/UploadModal';
import { TrackList } from './components/TrackList';
import { Player } from './components/Player';
import { EditorPanel } from './components/EditorPanel';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { EditorSettings, Track } from './types/music';

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    gain: 1,
    fadeIn: 0,
    fadeOut: 0,
    playbackRate: 1,
    trimStart: 0,
    trimEnd: 0,
  });
  const { audioRef, playerState, playTrack, pauseTrack, seekTo, setVolume } = useAudioPlayer(editorSettings);

  const handleUpload = (newTracks: Track[]) => {
    setTracks(prev => [...prev, ...newTracks]);
  };

  const handleTrackPlay = (track: Track) => {
    setEditorSettings(prev => ({ ...prev, trimStart: 0, trimEnd: track.duration }));
    playTrack(track);
  };

  const handlePlayPause = () => {
    if (playerState.isPlaying) {
      pauseTrack();
    } else if (playerState.currentTrack) {
      playTrack(playerState.currentTrack);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(217,70,239,0.18),_transparent_30%),#050510] text-white">
      <audio ref={audioRef} />
      
      <Header onUploadClick={() => setIsUploadOpen(true)} />
      
      <main className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-fuchsia-950/20">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.4em] text-fuchsia-200">Browser-native audio workstation</p>
            <h2 className="mb-3 text-4xl font-black text-white md:text-6xl">Upload. Audition. Edit. Export.</h2>
            <p className="max-w-3xl text-lg text-gray-300">
              Z3RO MUSIC EDITOR is a fast client-side studio for trimming tracks, previewing fades, adjusting gain, changing playback speed, and exporting edit manifests.
            </p>
          </div>

          <EditorPanel
            track={playerState.currentTrack}
            settings={editorSettings}
            onSettingsChange={setEditorSettings}
          />

          <div className="mb-4 mt-8">
            <h2 className="mb-2 text-3xl font-bold text-white">Session Library</h2>
            <p className="text-gray-400">
              {tracks.length === 0 ? 'No tracks imported yet' : `${tracks.length} track${tracks.length !== 1 ? 's' : ''} ready for editing`}
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <TrackList
              tracks={tracks}
              playerState={playerState}
              onTrackPlay={handleTrackPlay}
            />
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0">
        <Player
          playerState={playerState}
          onPlayPause={handlePlayPause}
          onSeek={seekTo}
          onVolumeChange={setVolume}
        />
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}

export default App;