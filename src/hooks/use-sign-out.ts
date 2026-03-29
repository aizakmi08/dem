import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '@/lib/db';
import { cancelReminder } from '@/hooks/use-notifications';
import { useOnboardingStore } from '@/stores/use-onboarding-store';
import { useSettingsStore } from '@/stores/use-settings-store';
import { usePlayerStore } from '@/stores/use-player-store';
import { useSubscriptionStore } from '@/stores/use-subscription-store';

export function useSignOut() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const performSignOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await cancelReminder();
      await db.auth.signOut();
      useOnboardingStore.getState().resetOnboarding();
      useSettingsStore.getState().resetSettings();
      usePlayerStore.getState().reset();
      useSubscriptionStore.getState().resetSubscription();
      router.replace('/(auth)/sign-in');
    } catch {
      Alert.alert(
        'Sign Out Failed',
        'Could not sign out. Please check your connection and try again.',
      );
      throw new Error('sign-out-failed');
    } finally {
      setIsSigningOut(false);
    }
  }, [router]);

  const signOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: performSignOut },
    ]);
  }, [performSignOut]);

  return { signOut, performSignOut, isSigningOut };
}
