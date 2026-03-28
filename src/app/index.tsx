import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';

export default function Index() {
  const { isLoading: authLoading, user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

  if (authLoading || (user && profileLoading)) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!profile?.onboardingComplete) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
