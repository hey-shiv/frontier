import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

let currentSessionId: string | null = null;

export async function getSessionId(): Promise<string> {
  if (currentSessionId) return currentSessionId;
  const stored = await AsyncStorage.getItem('mobile_session_id');
  if (stored) {
    currentSessionId = stored;
    return stored;
  }
  const newId = `sess_${Crypto.randomUUID()}`;
  await AsyncStorage.setItem('mobile_session_id', newId);
  currentSessionId = newId;
  return newId;
}
