import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../constants/theme";

const USER_NAME_STORAGE_KEY = "WALLYON_USER_NAME";

export default function IndexScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [storedName, setStoredName] = useState<string | null>(null);

  useEffect(() => {
    const checkUserName = async () => {
      try {
        const name = await AsyncStorage.getItem(USER_NAME_STORAGE_KEY);
        setStoredName(name);
      } catch (error) {
        console.log("User name could not be loaded:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserName();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  if (storedName) {
    return (
      <Redirect
        href={{
          pathname: "/tabs/home",
          params: {
            name: storedName,
          },
        }}
      />
    );
  }

  return <Redirect href="/onboarding" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
