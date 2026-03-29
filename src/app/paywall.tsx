import { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { useSubscriptionStore, type PlanType } from '@/stores/use-subscription-store';
import { getOfferings, purchasePackage, restorePurchases } from '@/lib/revenue-cat';

const HERO_COLOR = '#3D5A3D';

// Paywall always uses light colors regardless of theme
const PANEL = {
  bg: '#FAF7F2',
  surface: '#F0EBE3',
  text: '#4A3728',
  textSecondary: '#8C7B6E',
  border: '#E5DDD4',
  primary: '#5C7A5C',
  accent: '#C4603B',
  white: '#FFFFFF',
};

function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={20}
      style={({ pressed }) => [styles.closeButton, { opacity: pressed ? 0.6 : 1 }]}
    >
      <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
        <Path
          d="M1 1L11 11M11 1L1 11"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    </Pressable>
  );
}

function FeatureCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.featureCard}>
      {icon}
      <Text style={styles.featureLabel}>{label}</Text>
    </View>
  );
}

function StarIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="#C4603B">
      <Path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
    </Svg>
  );
}

function PlanCard({
  type,
  isSelected,
  onPress,
}: {
  type: PlanType;
  isSelected: boolean;
  onPress: () => void;
}) {
  const isYearly = type === 'yearly';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.planCard,
        {
          borderColor: isSelected ? PANEL.primary : PANEL.border,
          borderWidth: isSelected ? 2.5 : 1.5,
          backgroundColor: isSelected ? PANEL.white : PANEL.surface,
        },
      ]}
    >
      <View style={styles.planCardInner}>
        {isYearly && (
          <View style={[styles.badge, { backgroundColor: PANEL.accent }]}>
            <Text style={styles.badgeText}>SAVE 44%</Text>
          </View>
        )}
        <Text
          style={[
            styles.planLabel,
            { color: isSelected ? PANEL.text : PANEL.textSecondary, paddingTop: isYearly ? 6 : 0 },
          ]}
        >
          {isYearly ? 'Yearly' : 'Monthly'}
        </Text>
        <Text style={[styles.planPrice, { color: PANEL.text }]}>
          {isYearly ? '$19.99' : '$2.99'}
        </Text>
        <Text style={[styles.planSub, { color: PANEL.textSecondary }]}>
          {isYearly ? '$1.67/mo' : 'per month'}
        </Text>
      </View>
    </Pressable>
  );
}

export default function PaywallScreen() {
  const { spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const [packages, setPackages] = useState<{
    monthly?: any;
    yearly?: any;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getOfferings().then((offering) => {
      if (!offering) return;
      const monthly = offering.availablePackages.find(
        (p: any) => p.packageType === 'MONTHLY',
      );
      const yearly = offering.availablePackages.find(
        (p: any) => p.packageType === 'ANNUAL',
      );
      setPackages({ monthly, yearly });
    });
  }, []);

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, [router]);

  const handleStartTrial = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const pkg = selectedPlan === 'yearly' ? packages.yearly : packages.monthly;
    if (!pkg) {
      useSubscriptionStore.getState().setPremium(selectedPlan);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
      return;
    }

    setLoading(true);
    const success = await purchasePackage(pkg);
    setLoading(false);

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      useSubscriptionStore.getState().setPremium(selectedPlan);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [selectedPlan, packages, router]);

  const handleRestore = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    const success = await restorePurchases();
    setLoading(false);

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      useSubscriptionStore.getState().setPremium(null);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } else {
      Alert.alert('No purchases found', 'We couldn\'t find any active subscriptions to restore.');
    }
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: HERO_COLOR }]}>
      <StatusBar style="light" />

      {/* Hero Section */}
      <View style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}>
        {/* Ambient blobs */}
        <View style={[styles.blob, styles.blobTopRight]} />
        <View style={[styles.blob, styles.blobMidLeft]} />
        <View style={[styles.blob, styles.blobCenter]} />

        {/* Close button */}
        <View style={[styles.headerRow, { paddingHorizontal: spacing['2xl'] }]}>
          <View style={{ flex: 1 }} />
          <CloseButton onPress={handleClose} />
        </View>

        {/* Headline */}
        <View style={styles.headlineSection}>
          <Text style={styles.headline}>Your body will{'\n'}thank you</Text>
          <Text style={styles.subtitle}>
            Unlock every stretch, routine, and{'\n'}personalized plan — all in one place.
          </Text>
        </View>

        {/* Feature grid */}
        <View style={[styles.featureGrid, { paddingHorizontal: spacing['2xl'] }]}>
          <FeatureCard
            icon={
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M4 6h16M4 12h16M4 18h10"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </Svg>
            }
            label={'50+\nRoutines'}
          />
          <FeatureCard
            icon={
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={9} stroke="rgba(255,255,255,0.7)" strokeWidth={1.8} />
                <Path
                  d="M12 7v5l3 3"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </Svg>
            }
            label={'Daily\nPlans'}
          />
          <FeatureCard
            icon={
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            }
            label={'Streak\nRewards'}
          />
          <FeatureCard
            icon={
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 20V10M12 20V4M6 20v-6"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
            }
            label={'Track\nProgress'}
          />
        </View>
      </View>

      {/* Bottom Panel */}
      <Animated.View
        entering={FadeIn.delay(200).duration(400)}
        style={[styles.bottomPanel, { backgroundColor: PANEL.bg }]}
      >
        <View
          style={[
            styles.bottomContent,
            { paddingBottom: insets.bottom + spacing.xl },
          ]}
        >
          {/* Social proof */}
          <View style={styles.socialProof}>
            <View style={styles.stars}>
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
            </View>
            <Text style={[styles.socialText, { color: PANEL.textSecondary }]}>
              Loved by 10,000+ stretchers
            </Text>
          </View>

          {/* Plan cards */}
          <View style={styles.planRow}>
            <PlanCard
              type="yearly"
              isSelected={selectedPlan === 'yearly'}
              onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedPlan('yearly');
            }}
            />
            <PlanCard
              type="monthly"
              isSelected={selectedPlan === 'monthly'}
              onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedPlan('monthly');
            }}
            />
          </View>

          {/* CTA */}
          <Pressable
            onPress={handleStartTrial}
            disabled={loading}
            style={({ pressed }) => [
              styles.ctaButton,
              { backgroundColor: PANEL.primary, opacity: pressed || loading ? 0.7 : 1 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.ctaText}>Try Free for 3 Days</Text>
            )}</Pressable>

          {/* Disclaimer */}
          <Text style={[styles.disclaimer, { color: PANEL.textSecondary }]}>
            Then {selectedPlan === 'yearly' ? '$19.99/year' : '$2.99/month'} · Cancel
            anytime
          </Text>

          {/* Footer links */}
          <View style={styles.footer}>
            <Pressable hitSlop={12} onPress={handleRestore} disabled={loading}>
              <Text style={[styles.footerLink, { color: PANEL.textSecondary }]}>Restore</Text>
            </Pressable>
            <Text style={[styles.footerDot, { color: PANEL.border }]}>·</Text>
            <Pressable hitSlop={12}>
              <Text style={[styles.footerLink, { color: PANEL.textSecondary }]}>Terms</Text>
            </Pressable>
            <Text style={[styles.footerDot, { color: PANEL.border }]}>·</Text>
            <Pressable hitSlop={12}>
              <Text style={[styles.footerLink, { color: PANEL.textSecondary }]}>Privacy</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    overflow: 'hidden',
    position: 'relative',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
  },
  blobTopRight: {
    top: -50,
    right: -40,
    width: 180,
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  blobMidLeft: {
    top: 80,
    left: -40,
    width: 130,
    height: 130,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  blobCenter: {
    top: 60,
    left: '35%',
    width: 200,
    height: 200,
    backgroundColor: 'rgba(181, 196, 168, 0.1)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headlineSection: {
    alignItems: 'center',
    paddingTop: 24,
    gap: 12,
    position: 'relative',
    zIndex: 1,
  },
  headline: {
    fontSize: 32,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFFFFF',
    lineHeight: 38,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 20,
    textAlign: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 24,
    paddingBottom: 28,
    position: 'relative',
    zIndex: 1,
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  featureLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 16,
    textAlign: 'center',
  },
  bottomPanel: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  bottomContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 24,
    gap: 14,
  },
  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  socialText: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 14,
  },
  planRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  planCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'visible',
  },
  planCardInner: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    gap: 2,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 9999,
    position: 'absolute',
    top: -12,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFFFFF',
    lineHeight: 14,
    letterSpacing: 0.6,
  },
  planLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 16,
  },
  planPrice: {
    fontSize: 28,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 34,
  },
  planSub: {
    fontSize: 11,
    fontFamily: 'Nunito_600SemiBold',
    lineHeight: 14,
  },
  ctaButton: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 17,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFFFFF',
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    lineHeight: 16,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  footerLink: {
    fontSize: 11,
    fontFamily: 'Nunito_600SemiBold',
  },
  footerDot: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
  },
});
