import {
  memo,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Polyline, Line } from 'react-native-svg';
import { useSignOut } from '@/hooks/use-sign-out';
import {
  ConfirmationDrawer,
  type ConfirmationDrawerRef,
} from './confirmation-drawer';

export interface SignOutDrawerRef {
  present: () => void;
  dismiss: () => void;
}

const ICON_BG = '#F5DDD0';
const ICON_COLOR = '#C25B3A';

function SignOutIcon() {
  return (
    <View style={[styles.iconBadge, { backgroundColor: ICON_BG }]}>
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <Path
          d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
          stroke={ICON_COLOR}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Polyline
          points="16,17 21,12 16,7"
          stroke={ICON_COLOR}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Line
          x1={21}
          y1={12}
          x2={9}
          y2={12}
          stroke={ICON_COLOR}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const SignOutDrawerBase = forwardRef<SignOutDrawerRef>(
  function SignOutDrawer(_props, ref) {
    const { performSignOut } = useSignOut();
    const confirmRef = useRef<ConfirmationDrawerRef>(null);

    useImperativeHandle(ref, () => ({
      present: () => confirmRef.current?.present(),
      dismiss: () => confirmRef.current?.dismiss(),
    }));

    const handleConfirm = useCallback(async () => {
      await performSignOut();
    }, [performSignOut]);

    return (
      <ConfirmationDrawer
        ref={confirmRef}
        name="SignOutDrawer"
        iconNode={<SignOutIcon />}
        title="Sign Out?"
        description="You'll need to sign in again with your email to access your routines and progress."
        primaryLabel="SIGN OUT"
        primaryColor={ICON_COLOR}
        onConfirm={handleConfirm}
      />
    );
  },
);

export const SignOutDrawer = memo(SignOutDrawerBase);

const styles = StyleSheet.create({
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
