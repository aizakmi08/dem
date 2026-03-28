import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { db } from '@/lib/db';
import { BackButton } from '@/components/ui/back-button';
import { TextInputField } from '@/components/ui/text-input-field';

function LockIcon({ color }: { color: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 11V8A5 5 0 0 0 7 8v3"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z"
        stroke={color}
        strokeWidth={1.8}
      />
    </Svg>
  );
}

function CameraIcon({ color }: { color: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={13} r={4} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, typography, spacing, radius } = useTheme();
  const { user } = useAuth();
  const { profile } = useProfile();

  const email = user?.email ?? '';
  const localPart = email.split('@')[0];
  const derivedName = localPart ? localPart.charAt(0).toUpperCase() + localPart.slice(1) : '';
  const initialName = profile?.displayName ?? derivedName;

  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = name.trim() !== initialName;

  async function handleSave() {
    if (!profile?.id || isSaving || !hasChanges) return;
    setIsSaving(true);
    try {
      await db.transact(
        db.tx.profiles[profile.id].update({
          displayName: name.trim(),
          updatedAt: Date.now(),
        }),
      );
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Alert.alert('Error', 'Could not save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <BackButton onPress={() => router.back()} />
        <Text style={[typography.title, styles.headerTitle, { color: colors.text }]}>
          Edit Profile
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <Pressable
          style={styles.avatarSection}
          onPress={() => Alert.alert('Coming soon', 'Photo upload will be added in a future update.')}
        >
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatar, { backgroundColor: colors.surface }]}>
              <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={8} r={4} stroke={colors.textSecondary} strokeWidth={1.5} />
                <Path
                  d="M5 20c0-3.31 3.13-6 7-6s7 2.69 7 6"
                  stroke={colors.textSecondary}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
            <View style={[styles.cameraBadge, { backgroundColor: colors.primary }]}>
              <CameraIcon color={colors.white} />
            </View>
          </View>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: spacing.sm }]}>
            Tap to change photo
          </Text>
        </Pressable>

        {/* Form */}
        <View style={[styles.form, { paddingHorizontal: spacing['2xl'], gap: spacing.xl }]}>
          <TextInputField
            label="NAME"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInputField
            label="EMAIL"
            value={email}
            editable={false}
            rightIcon={<LockIcon color={colors.textSecondary} />}
            helperText="Email is used for sign-in and cannot be changed"
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing['2xl'], paddingHorizontal: spacing['2xl'] }]}>
        <Pressable
          onPress={handleSave}
          disabled={!hasChanges || isSaving}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.xl,
              opacity: !hasChanges || isSaving ? 0.5 : pressed ? 0.9 : 1,
            },
          ]}
        >
          {isSaving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={[typography.button, { color: colors.white }]}>SAVE CHANGES</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 24,
  },
  scrollContent: {
    flexGrow: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 8,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    paddingTop: 32,
  },
  bottomBar: {
    paddingTop: 16,
  },
  saveButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
