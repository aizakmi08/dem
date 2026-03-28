import { useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useSettingsStore } from '@/stores/use-settings-store';

export function useSounds() {
  const countdownPlayer = useAudioPlayer(
    require('../../assets/sounds/countdown.wav'),
  );
  const transitionPlayer = useAudioPlayer(
    require('../../assets/sounds/transition.wav'),
  );
  const completePlayer = useAudioPlayer(
    require('../../assets/sounds/complete.wav'),
  );

  const playCountdown = useCallback(() => {
    if (!useSettingsStore.getState().soundEnabled) return;
    countdownPlayer.seekTo(0);
    countdownPlayer.play();
  }, [countdownPlayer]);

  const playTransition = useCallback(() => {
    if (!useSettingsStore.getState().soundEnabled) return;
    transitionPlayer.seekTo(0);
    transitionPlayer.play();
  }, [transitionPlayer]);

  const playComplete = useCallback(() => {
    if (!useSettingsStore.getState().soundEnabled) return;
    completePlayer.seekTo(0);
    completePlayer.play();
  }, [completePlayer]);

  return { playCountdown, playTransition, playComplete };
}
