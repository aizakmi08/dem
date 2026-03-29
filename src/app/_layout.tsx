import { useEffect, useMemo } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { useSettingsStore } from '@/stores/use-settings-store';
import { useProfileSync } from '@/hooks/use-profile-sync';
import { configureRevenueCat } from '@/lib/revenue-cat';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useSettingsStore((s) => s.theme);
  useProfileSync();

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    configureRevenueCat();
  }, []);

  const systemScheme = useColorScheme();

  useEffect(() => {
    Appearance.setColorScheme(
      theme === 'system' ? 'unspecified' : theme === 'dark' ? 'dark' : 'light',
    );
  }, [theme]);

  const isDark = theme === 'dark' || (theme === 'system' && systemScheme === 'dark');

  const navigationTheme = useMemo(
    () =>
      isDark
        ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: '#1C1814' } }
        : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#FAF7F2' } },
    [isDark],
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider value={navigationTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="paywall" options={{ animation: 'fade', gestureEnabled: false }} />
          </Stack>
          <StatusBar style={theme === 'system' ? 'auto' : theme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
