import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = AsyncStorage;

const getStringItem = (key: string) => {
  return storage.getItem(key) || "";
};

const setItem = (key: string, value: any) => {
  storage.setItem(key, value);
};

export { getStringItem, setItem };
