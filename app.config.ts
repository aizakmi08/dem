import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Dem",
  slug: "daily-stretching",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "dem",
  userInterfaceStyle: "automatic",
  splash: {
    backgroundColor: "#FAF7F2",
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.zhapar.dem",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
      backgroundColor: "#FAF7F2",
    },
    package: "com.zhapar.dem",
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#FAF7F2",
        android: {
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      },
    ],
    "expo-font",
    [
      "expo-notifications",
      {
        color: "#5C7A5C",
      },
    ],
    "expo-audio",
    "expo-apple-authentication",
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme:
          "com.googleusercontent.apps.381396961429-ssbq2frv0nc1aqicov1iuouqsmapm41s",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    instantDbAppId: process.env.INSTANT_APP_ID ?? "",
    googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID ?? "",
    revenueCatApiKeyIos: process.env.REVENUECAT_API_KEY_IOS ?? "",
    revenueCatApiKeyAndroid: process.env.REVENUECAT_API_KEY_ANDROID ?? "",
    eas: {
      projectId: "99932df4-2afe-4aff-8254-3c4993d87709",
    },
  },
});
