import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileActions from "../../components/profile/ProfileActions";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileNameCard from "../../components/profile/ProfileNameCard";
import { colors } from "../../constants/theme";
import {
  clearProfileStorage,
  getStoredUserName,
  removeStoredUserName,
} from "../../services/profileStorage";

export default function ProfileScreen() {
  const [name, setName] = useState("");

  const loadUserName = async () => {
    try {
      const storedName = await getStoredUserName();
      setName(storedName || "");
    } catch (error) {
      console.log("User name could not be loaded:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserName();
    }, []),
  );

  const redirectToOnboarding = () => {
    router.replace("/onboarding");
  };

  const goToOnboardingForNameChange = async () => {
    try {
      await removeStoredUserName();
      setName("");
      redirectToOnboarding();
    } catch (error) {
      console.log("User name could not be removed:", error);
      Alert.alert("Hata", "İsim değiştirme ekranına geçilirken sorun oluştu.");
    }
  };

  const deleteProfileAndRedirect = async () => {
    try {
      await clearProfileStorage();
      setName("");

      setTimeout(() => {
        redirectToOnboarding();
      }, 100);
    } catch (error) {
      console.log("Profile could not be deleted:", error);
      Alert.alert("Hata", "Profil silinirken bir sorun oluştu.");
    }
  };

  const handleDeleteProfile = () => {
    Alert.alert("Profili Sil", "Profilini silmek istediğine emin misin?", [
      {
        text: "Vazgeç",
        style: "cancel",
      },
      {
        text: "Sil",
        style: "destructive",
        onPress: deleteProfileAndRedirect,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ProfileHeader />

        <ProfileNameCard name={name} />

        <ProfileActions
          onChangeName={goToOnboardingForNameChange}
          onDeleteProfile={handleDeleteProfile}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});
