import { memo, useMemo } from 'react';
import { View, Text, Modal, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from '@/theme';
import type { Exercise } from '@/content/types';
import {
  InstructionsSection,
  TipsSection,
  ModificationsSection,
  BenefitsSection,
} from './exercise-info-sections';

interface ExerciseInfoModalProps {
  exercise: Exercise | null;
  visible: boolean;
  onClose: () => void;
}

export const ExerciseInfoModal = memo(function ExerciseInfoModal({
  exercise,
  visible,
  onClose,
}: ExerciseInfoModalProps) {
  const { colors, typography, radius } = useTheme();
  const insets = useSafeAreaInsets();

  const scrollContentStyle = useMemo(
    () => [styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) }],
    [insets.bottom]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.handleArea}>
          <View style={[styles.handle, { backgroundColor: colors.border, borderRadius: radius.full }]} />
        </View>

        <View style={styles.headerRow}>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={({ pressed }) => [
              styles.closeButton,
              { backgroundColor: colors.surface, borderRadius: radius.full, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
              <Path
                d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
                stroke={colors.textSecondary}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
        </View>

        {exercise && (
          <>
            <Text style={[typography.heading, styles.title, { color: colors.text }]}>
              {exercise.name}
            </Text>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={scrollContentStyle}
              showsVerticalScrollIndicator={false}
            >
              <InstructionsSection instructions={exercise.instructions} />
              <TipsSection tips={exercise.tips} />
              <ModificationsSection modifications={exercise.modifications} />
              <BenefitsSection benefits={exercise.benefits} />
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
});
