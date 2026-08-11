export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  file: File;
  url: string;
  uploadedAt: Date;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  currentTime: number;
  volume: number;
  isLoading: boolean;
}

export interface EditorSettings {
  gain: number;
  fadeIn: number;
  fadeOut: number;
  playbackRate: number;
  trimStart: number;
  trimEnd: number;
}
