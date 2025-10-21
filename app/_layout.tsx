import ThemeProvider from '@/theme/ThemeProvider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { theme } = useThemeStore();
  const appTheme = useAppTheme();

  const paperTheme = theme === 'dark'
    ? {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: appTheme.accent,
        background: appTheme.background,
        surface: appTheme.surface,
        text: appTheme.text,
        onSurface: appTheme.text,
        backdrop: appTheme.background,
      },
      dark: true,
    }
    : {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: appTheme.accent,
        background: appTheme.background,
        surface: appTheme.surface,
        text: appTheme.text,
        onSurface: appTheme.text,
        backdrop: appTheme.background,
      },
      dark: false,
    };

  const navigationTheme = theme === 'dark'
    ? {
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: appTheme.background,
        text: appTheme.text,
        border: appTheme.border,
        card: appTheme.card,
      },
    }
    : {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: appTheme.background,
        text: appTheme.text,
        border: appTheme.border,
        card: appTheme.card,
      },
    };

  return (
    <ThemeProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationThemeProvider value={navigationTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </NavigationThemeProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
