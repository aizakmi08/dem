import { AppLogo } from "@/components/ui/app-logo";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/db";
import { useTheme } from "@/theme";
import NetInfo from "@react-native-community/netinfo";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import "react-native-get-random-values";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const TERMS_URL = "https://dem-app.com/terms";
const PRIVACY_URL = "https://dem-app.com/privacy";

const GOOGLE_IOS_CLIENT_ID =
  (Constants.expoConfig?.extra?.googleIosClientId as string) ?? "";

if (!GOOGLE_IOS_CLIENT_ID) {
  console.warn(
    "[SignIn] GOOGLE_IOS_CLIENT_ID is not set. Google Sign-In will not work.",
  );
} else {
  GoogleSignin.configure({ iosClientId: GOOGLE_IOS_CLIENT_ID });
}

type LoadingProvider = "apple" | "google" | null;

async function getNetworkAwareErrorMessage(provider: string): Promise<string> {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    return "No internet connection. Please check your network and try again.";
  }
  return `Could not sign in with ${provider}. Please try again.`;
}

function generateNonce(length = 32): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values)
    .map((v) => charset[v % charset.length])
    .join("");
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function SignInScreen() {
  const { colors, typography, spacing, components } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<LoadingProvider>(null);

  const loading = loadingProvider !== null;

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const handleAppleSignIn = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoadingProvider("apple");
    try {
      const rawNonce = generateNonce();
      const hashedNonce = await sha256(rawNonce);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (!credential.identityToken) {
        throw new Error("No identity token returned");
      }

      await db.auth.signInWithIdToken({
        clientName: "apple",
        idToken: credential.identityToken,
        nonce: rawNonce,
      });
    } catch (e: unknown) {
      if ((e as { code?: string }).code === "ERR_REQUEST_CANCELED") return;
      const message = await getNetworkAwareErrorMessage("Apple");
      Alert.alert("Sign In Failed", message);
    } finally {
      setLoadingProvider(null);
    }
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoadingProvider("google");
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type !== "success") return;

      const idToken = response.data?.idToken;
      if (!idToken) {
        throw new Error("No ID token returned");
      }

      await db.auth.signInWithIdToken({
        clientName: "google",
        idToken,
      });
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (err.code === statusCodes.IN_PROGRESS) return;
      const message = await getNetworkAwareErrorMessage("Google");
      Alert.alert("Sign In Failed", message);
    } finally {
      setLoadingProvider(null);
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topSpacer} />

      <View style={[styles.logoArea, { gap: spacing.lg }]}>
        <AppLogo size={88} />
        <View style={[styles.logoText, { gap: spacing.sm }]}>
          <Text style={[typography.display, { color: colors.text }]}>Dem</Text>
          <Text
            style={[
              typography.body,
              { color: colors.textSecondary, textAlign: "center" },
            ]}
          >
            Your daily stretching companion
          </Text>
        </View>
      </View>

      <View style={styles.flexSpacer} />

      <View
        style={[
          styles.authButtons,
          { paddingHorizontal: spacing["2xl"], gap: spacing.md },
        ]}
      >
        <Pressable
          onPress={handleAppleSignIn}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            {
              ...components.button.dark,
              opacity: pressed || loading ? 0.85 : 1,
            },
          ]}
        >
          {loadingProvider === "apple" ? (
            <ActivityIndicator color={components.button.dark.color} />
          ) : (
            <>
              <AppleIcon />
              <Text
                style={[
                  typography.button,
                  {
                    color: components.button.dark.color,
                    textTransform: "none",
                  },
                ]}
              >
                Continue with Apple
              </Text>
            </>
          )}
        </Pressable>

        <Pressable
          onPress={handleGoogleSignIn}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            {
              ...components.button.secondary,
              opacity: pressed || loading ? 0.85 : 1,
            },
          ]}
        >
          {loadingProvider === "google" ? (
            <ActivityIndicator color={components.button.secondary.color} />
          ) : (
            <>
              <GoogleIcon />
              <Text
                style={[
                  typography.button,
                  {
                    color: components.button.secondary.color,
                    textTransform: "none",
                  },
                ]}
              >
                Continue with Google
              </Text>
            </>
          )}
        </Pressable>
      </View>

      <View
        style={[
          styles.terms,
          { paddingTop: spacing.xl, paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
          By continuing, you agree to our{" "}
          <Text
            style={styles.termsLink}
            onPress={() => WebBrowser.openBrowserAsync(TERMS_URL)}
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            style={styles.termsLink}
            onPress={() => WebBrowser.openBrowserAsync(PRIVACY_URL)}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );
}

function AppleIcon() {
  return (
    <Svg width={20} height={24} viewBox="0 0 20 24" fill="none">
      <Path
        d="M17.05 12.54C17.02 9.73 19.32 8.36 19.43 8.3C18.12 6.42 16.1 6.16 15.38 6.14C13.71 5.97 12.1 7.15 11.25 7.15C10.39 7.15 9.07 6.16 7.66 6.19C5.84 6.22 4.15 7.28 3.22 8.93C1.3 12.29 2.73 17.24 4.57 19.96C5.49 21.29 6.57 22.79 7.98 22.73C9.36 22.67 9.88 21.83 11.52 21.83C13.15 21.83 13.63 22.73 15.08 22.7C16.56 22.67 17.49 21.35 18.38 20.01C19.43 18.47 19.84 16.96 19.86 16.88C19.83 16.87 17.08 15.82 17.05 12.54Z"
        fill="#FFFFFF"
      />
      <Path
        d="M14.46 4.26C15.2 3.34 15.7 2.09 15.56 0.83C14.49 0.87 13.18 1.56 12.41 2.46C11.73 3.26 11.12 4.55 11.28 5.77C12.48 5.86 13.7 5.16 14.46 4.26Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M19.6 10.23C19.6 9.53 19.54 8.86 19.42 8.22H10V12.04H15.38C15.15 13.29 14.44 14.36 13.38 15.08V17.58H16.62C18.51 15.84 19.6 13.27 19.6 10.23Z"
        fill="#4285F4"
      />
      <Path
        d="M10 20C12.7 20 14.96 19.1 16.62 17.58L13.38 15.08C12.49 15.68 11.35 16.04 10 16.04C7.39 16.04 5.19 14.28 4.4 11.92H1.07V14.49C2.72 17.76 6.09 20 10 20Z"
        fill="#34A853"
      />
      <Path
        d="M4.4 11.92C4.2 11.32 4.09 10.68 4.09 10.02C4.09 9.36 4.2 8.72 4.4 8.12V5.55H1.07C0.39 6.89 0 8.41 0 10.02C0 11.63 0.39 13.15 1.07 14.49L4.4 11.92Z"
        fill="#FBBC05"
      />
      <Path
        d="M10 3.96C11.47 3.96 12.79 4.47 13.82 5.47L16.69 2.6C14.96 0.99 12.7 0 10 0C6.09 0 2.72 2.24 1.07 5.51L4.4 8.08C5.19 5.72 7.39 3.96 10 3.96Z"
        fill="#EA4335"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  topSpacer: {
    flex: 2.5,
  },
  logoArea: {
    alignItems: "center",
  },
  logoText: {
    alignItems: "center",
  },
  flexSpacer: {
    flex: 2,
  },
  authButtons: {
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  terms: {
    paddingHorizontal: 48,
  },
  termsText: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    lineHeight: 18,
    textAlign: "center",
  },
  termsLink: {
    textDecorationLine: "underline",
  },
});
