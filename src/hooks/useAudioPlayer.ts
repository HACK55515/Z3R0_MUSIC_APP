import { useState, useRef, useEffect } from 'react';
import { EditorSettings, PlayerState, Track } from '../types/music';

export const useAudioPlayer = (editorSettings: EditorSettings) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTrack: null,
    currentTime: 0,
    volume: 0.8,
    isLoading: false,
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = Math.min(playerState.volume * editorSettings.gain, 1);
    audio.playbackRate = editorSettings.playbackRate;
  }, [editorSettings.gain, editorSettings.playbackRate, playerState.volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const trimEnd = editorSettings.trimEnd || playerState.currentTrack?.duration || 0;
      const fadeInVolume = editorSettings.fadeIn > 0
        ? Math.min((audio.currentTime - editorSettings.trimStart) / editorSettings.fadeIn, 1)
        : 1;
      const fadeOutVolume = editorSettings.fadeOut > 0 && trimEnd > 0
        ? Math.min((trimEnd - audio.currentTime) / editorSettings.fadeOut, 1)
        : 1;
      const shapedVolume = Math.max(0, Math.min(fadeInVolume, fadeOutVolume));

      audio.volume = Math.min(playerState.volume * editorSettings.gain * shapedVolume, 1);

      if (trimEnd > 0 && audio.currentTime >= trimEnd) {
        audio.pause();
        audio.currentTime = editorSettings.trimStart;
        setPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: editorSettings.trimStart }));
        return;
      }

      setPlayerState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const handleLoadStart = () => {
      setPlayerState(prev => ({ ...prev, isLoading: true }));
    };

    const handleLoadedData = () => {
      setPlayerState(prev => ({ ...prev, isLoading: false }));
    };

    const handleEnded = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: editorSettings.trimStart }));
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [editorSettings, playerState.currentTrack?.duration, playerState.volume]);

  const playTrack = (track: Track) => {
    if (!audioRef.current) return;

    audioRef.current.playbackRate = editorSettings.playbackRate;

    if (playerState.currentTrack?.id === track.id) {
      if (playerState.isPlaying) {
        audioRef.current.pause();
        setPlayerState(prev => ({ ...prev, isPlaying: false }));
      } else {
        if (audioRef.current.currentTime < editorSettings.trimStart) {
          audioRef.current.currentTime = editorSettings.trimStart;
        }
        audioRef.current.play();
        setPlayerState(prev => ({ ...prev, isPlaying: true }));
      }
    } else {
      audioRef.current.src = track.url;
      audioRef.current.currentTime = editorSettings.trimStart;
      audioRef.current.play();
      setPlayerState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: true,
        currentTime: editorSettings.trimStart,
      }));
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPlayerState(prev => ({ ...prev, currentTime: time }));
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(volume * editorSettings.gain, 1);
      setPlayerState(prev => ({ ...prev, volume }));
    }
  };

  return {
    audioRef,
    playerState,
    playTrack,
    pauseTrack,
    seekTo,
    setVolume,
  };
};
