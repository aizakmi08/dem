import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';

type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'loading';

export function useNotificationPermission() {
  const [status, setStatus] = useState<PermissionStatus>('loading');

  const checkPermission = useCallback(async () => {
    const { status: currentStatus } = await Notifications.getPermissionsAsync();
    setStatus(currentStatus === 'granted' ? 'granted' : currentStatus === 'denied' ? 'denied' : 'undetermined');
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') checkPermission();
    });
    return () => sub.remove();
  }, [checkPermission]);

  return {
    status,
    isBlocked: status === 'denied',
    recheck: checkPermission,
  };
}
