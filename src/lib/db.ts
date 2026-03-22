import { init } from '@instantdb/react-native';
import schema from '../../instant.schema';
import Constants from 'expo-constants';

const APP_ID = Constants.expoConfig?.extra?.instantDbAppId as string;

export const db = init({ appId: APP_ID, schema });
