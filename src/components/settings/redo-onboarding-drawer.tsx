import {
  memo,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { db } from '@/lib/db';
import { useOnboardingStore } from '@/stores/use-onboarding-store';
import { useProfile } from '@/hooks/use-profile';
import {
  ConfirmationDrawer,
  type ConfirmationDrawerRef,
} from './confirmation-drawer';

export interface RedoOnboardingDrawerRef {
  present: () => void;
  dismiss: () => void;
}

const ICON_BG = '#F5E6D0';
const ICON_COLOR = '#C4872A';

function WarningIcon() {
  return (
    <View style={[styles.iconBadge, { backgroundColor: ICON_BG }]}>
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <Path
          d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke={ICON_COLOR}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Line
          x1={12}
          y1={9}
          x2={12}
          y2={13}
          stroke={ICON_COLOR}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Circle cx={12} cy={17} r={0.5} fill={ICON_COLOR} stroke={ICON_COLOR} />
      </Svg>
    </View>
  );
}

const RedoOnboardingDrawerBase = forwardRef<RedoOnboardingDrawerRef>(
  function RedoOnboardingDrawer(_props, ref) {
    const router = useRouter();
    const { profile } = useProfile();
    const confirmRef = useRef<ConfirmationDrawerRef>(null);

    useImperativeHandle(ref, () => ({
      present: () => confirmRef.current?.present(),
      dismiss: () => confirmRef.current?.dismiss(),
    }));

    const handleConfirm = useCallback(async () => {
      try {
        if (profile?.id) {
          await db.transact(
            db.tx.profiles[profile.id].update({ onboardingComplete: false }),
          );
        }
        useOnboardingStore.getState().resetOnboarding();
        router.replace('/(onboarding)/welcome');
      } catch {
        Alert.alert('Error', 'Could not reset onboarding. Please try again.');
        throw new Error('redo-onboarding-failed');
      }
    }, [router, profile]);

    return (
      <ConfirmationDrawer
        ref={confirmRef}
        name="RedoOnboardingDrawer"
        iconNode={<WarningIcon />}
        title="Redo Onboarding Quiz?"
        description="This will reset your age, experience level, and goals. Your routines and progress will not be affected."
        primaryLabel="REDO QUIZ"
        primaryColor={ICON_COLOR}
        onConfirm={handleConfirm}
      />
    );
  },
);

export const RedoOnboardingDrawer = memo(RedoOnboardingDrawerBase);

const styles = StyleSheet.create({
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
