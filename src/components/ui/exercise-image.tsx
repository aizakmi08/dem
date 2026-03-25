import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { getExerciseIllustration } from '@/content/illustrations';

interface ExerciseImageProps {
  iconFilename: string;
  /** Width and height of the image container */
  size: number;
  /** Make it circular. Defaults to true. */
  round?: boolean;
}

/**
 * Shared exercise illustration component using expo-image for fast cached loading.
 * Renders a circular (or square-rounded) image at the given size.
 */
export const ExerciseImage = memo(function ExerciseImage({
  iconFilename,
  size,
  round = true,
}: ExerciseImageProps) {
  const source = getExerciseIllustration(iconFilename);
  if (!source) return null;

  const borderRadius = round ? size / 2 : 8;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius }]}>
      <Image
        source={source}
        style={{ width: size, height: size, borderRadius }}
        contentFit="cover"
        cachePolicy="memory-disk"
        recyclingKey={iconFilename}
        transition={150}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
