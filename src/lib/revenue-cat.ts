import { Platform } from 'react-native';
import Constants from 'expo-constants';

const API_KEY_IOS = Constants.expoConfig?.extra?.revenueCatApiKeyIos ?? '';
const API_KEY_ANDROID = Constants.expoConfig?.extra?.revenueCatApiKeyAndroid ?? '';

let isConfigured = false;

// Lazy import to avoid crashes when native module is unavailable
function getPurchases() {
  try {
    return require('react-native-purchases').default;
  } catch {
    return null;
  }
}

export async function configureRevenueCat(userId?: string) {
  if (isConfigured) return;

  const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;
  if (!apiKey) return;

  const Purchases = getPurchases();
  if (!Purchases) {
    console.warn('[RevenueCat] Native module not available');
    return;
  }

  try {
    Purchases.configure({ apiKey, appUserID: userId ?? undefined });
    isConfigured = true;
  } catch (err) {
    console.warn('[RevenueCat] Failed to configure', err);
  }
}

export async function identifyUser(userId: string) {
  if (!isConfigured) return;
  const Purchases = getPurchases();
  if (!Purchases) return;
  try {
    await Purchases.logIn(userId);
  } catch (err) {
    console.warn('[RevenueCat] Failed to identify user', err);
  }
}

export async function getCustomerInfo() {
  if (!isConfigured) return null;
  const Purchases = getPurchases();
  if (!Purchases) return null;
  try {
    return await Purchases.getCustomerInfo();
  } catch {
    return null;
  }
}

export function checkPremiumAccess(info: any): boolean {
  return info?.entitlements?.active && Object.keys(info.entitlements.active).length > 0;
}

export async function getOfferings() {
  if (!isConfigured) return null;
  const Purchases = getPurchases();
  if (!Purchases) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (err) {
    console.warn('[RevenueCat] Failed to get offerings', err);
    return null;
  }
}

export async function purchasePackage(pkg: any): Promise<boolean> {
  if (!isConfigured) return false;
  const Purchases = getPurchases();
  if (!Purchases) return false;
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return checkPremiumAccess(customerInfo);
  } catch (err: any) {
    if (!err.userCancelled) {
      console.warn('[RevenueCat] Purchase failed', err);
    }
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!isConfigured) return false;
  const Purchases = getPurchases();
  if (!Purchases) return false;
  try {
    const info = await Purchases.restorePurchases();
    return checkPremiumAccess(info);
  } catch {
    return false;
  }
}
