import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface PauseOverlayProps {
  onResume: () => void;
  onEnd: () => void;
}

export function PauseOverlay({ onResume, onEnd }: PauseOverlayProps) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={styles.container}
    >
      <View style={styles.center}>
        <Text style={styles.title}>Paused</Text>
        <Text style={styles.subtitle}>Take a breather</Text>
      </View>

      <View style={[styles.buttons, { paddingBottom: Math.max(insets.bottom, 32) }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onResume();
          }}
          style={({ pressed }) => [
            styles.resumeButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.resumeText}>Resume</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onEnd();
          }}
          style={({ pressed }) => [
            styles.endButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.endText}>End Session</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 15,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
  },
  buttons: {
    paddingHorizontal: 24,
    gap: 12,
  },
  resumeButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#5C7A5C',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  endButton: {
    width: '100%',
    height: 56,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
