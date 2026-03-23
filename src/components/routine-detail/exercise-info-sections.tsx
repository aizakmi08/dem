import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

function BulletItem({ text }: { text: string }) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.itemRow}>
      <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
      <Text style={[typography.body, styles.flexText, { color: colors.text }]}>{text}</Text>
    </View>
  );
}

interface InstructionsSectionProps {
  instructions: string[];
}

export const InstructionsSection = memo(function InstructionsSection({
  instructions,
}: InstructionsSectionProps) {
  const { colors, typography, radius } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[typography.overline, { color: colors.accent }]}>Instructions</Text>
      {instructions.map((step, i) => (
        <View key={i} style={styles.itemRow}>
          <View style={[styles.badge, { backgroundColor: colors.surface, borderRadius: radius.full }]}>
            <Text style={[typography.label, { color: colors.textSecondary }]}>{i + 1}</Text>
          </View>
          <Text style={[typography.body, styles.flexText, { color: colors.text }]}>{step}</Text>
        </View>
      ))}
    </View>
  );
});

interface TipsSectionProps {
  tips: string[];
}

export const TipsSection = memo(function TipsSection({ tips }: TipsSectionProps) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[typography.overline, { color: colors.accent }]}>Tips</Text>
      {tips.map((tip, i) => (
        <BulletItem key={i} text={tip} />
      ))}
    </View>
  );
});

interface ModificationsSectionProps {
  modifications: {
    easier: string;
    harder: string;
  };
}

export const ModificationsSection = memo(function ModificationsSection({
  modifications,
}: ModificationsSectionProps) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[typography.overline, { color: colors.accent }]}>Modifications</Text>
      <BulletItem text={modifications.easier} />
      <BulletItem text={modifications.harder} />
    </View>
  );
});

interface BenefitsSectionProps {
  benefits: string[];
}

export const BenefitsSection = memo(function BenefitsSection({
  benefits,
}: BenefitsSectionProps) {
  const { colors, typography, components } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[typography.overline, { color: colors.accent }]}>Benefits</Text>
      <View style={styles.chipsContainer}>
        {benefits.map((benefit, i) => (
          <View
            key={i}
            style={{
              backgroundColor: components.chip.backgroundColor,
              borderRadius: components.chip.borderRadius,
              paddingVertical: components.chip.paddingVertical,
              paddingHorizontal: components.chip.paddingHorizontal,
            }}
          >
            <Text style={[typography.bodySmall, { color: colors.text }]}>{benefit}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  badge: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 9,
  },
  flexText: {
    flex: 1,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
