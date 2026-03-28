import {
  memo,
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
} from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useTheme } from '@/theme';

export interface ConfirmationDrawerRef {
  present: () => void;
  dismiss: () => void;
}

interface ConfirmationDrawerProps {
  name: string;
  iconNode: ReactNode;
  title: string;
  description: string;
  primaryLabel: string;
  primaryColor: string;
  onConfirm: () => void | Promise<void>;
}

const CANCEL_BG = '#EDE8DC';

const ConfirmationDrawerBase = forwardRef<
  ConfirmationDrawerRef,
  ConfirmationDrawerProps
>(function ConfirmationDrawer(
  { name, iconNode, title, description, primaryLabel, primaryColor, onConfirm },
  ref,
) {
  const { colors, typography, radius } = useTheme();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [saving, setSaving] = useState(false);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const handleConfirm = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onConfirm();
      sheetRef.current?.dismiss();
    } catch {
      // onConfirm handles its own error UI
    } finally {
      setSaving(false);
    }
  }, [onConfirm, saving]);

  const handleCancel = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      name={name}
      stackBehavior="replace"
      enableDynamicSizing
      maxDynamicContentSize={500}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{
        backgroundColor: colors.border,
        width: 36,
        height: 4,
      }}
    >
      <BottomSheetView>
        <View style={styles.content}>
          {iconNode}
          <Text
            style={[
              styles.title,
              { color: colors.text, fontFamily: 'Nunito_700Bold' },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              typography.bodyMedium,
              styles.description,
              { color: colors.textSecondary },
            ]}
          >
            {description}
          </Text>
        </View>

        <View
          style={[
            styles.buttonArea,
            { paddingBottom: 24 },
          ]}
        >
          <Pressable
            onPress={handleConfirm}
            disabled={saving}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: primaryColor,
                borderRadius: radius.lg,
                opacity: pressed || saving ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[typography.button, { color: colors.white }]}>
              {saving ? 'Please wait...' : primaryLabel}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleCancel}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: CANCEL_BG,
                borderRadius: radius.lg,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[typography.button, { color: colors.text }]}>
              CANCEL
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export const ConfirmationDrawer = memo(ConfirmationDrawerBase);

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 8,
    paddingHorizontal: 24,
    gap: 14,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 22,
  },
  buttonArea: {
    paddingTop: 20,
    paddingHorizontal: 24,
    gap: 10,
  },
  button: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
