import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ encryptionKey: "some_key_frwasda", id: "1" });

const getStringItem = async (key: string) => {
  return await storage.getString(key);
};

const getBooleanItem = async (key: string) => {
  return await storage.getBoolean(key);
};

const getNumber = async (key: string) => {
  return await storage.getNumber(key);
};

const setItem = async (key: string, value: any) => {
  storage.set(key, value);
  return null;
};

export { getStringItem, getBooleanItem, getNumber, setItem };
