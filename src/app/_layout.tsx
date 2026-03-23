import { useEffect, useMemo } from 'react';
import { Appearance } from 'react-native';
import { Stack } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { useSettingsStore } from '@/stores/use-settings-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useSettingsStore((s) => s.theme);

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
    Appearance.setColorScheme(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  const navigationTheme = useMemo(
    () =>
      theme === 'dark'
        ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: '#1C1814' } }
        : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#FAF7F2' } },
    [theme],
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
