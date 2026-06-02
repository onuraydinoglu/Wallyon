import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../components/ui/AppButton";
import AppDateField from "../components/ui/AppDateField";
import AppDatePickerModal from "../components/ui/AppDatePickerModal";
import AppIconButton from "../components/ui/AppIconButton";
import AppInput from "../components/ui/AppInput";
import { colors } from "../constants/theme";
import { getStoredNotes, saveStoredNotes } from "../services/noteStorage";
import { Note } from "../types/note";
import { formatDateTR } from "../utils/dateUtils";

const formatStorageDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function AddNoteScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Uyarı", "Not başlığı boş olamaz.");
      return;
    }

    try {
      const notes = await getStoredNotes();

      const newNote: Note = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        date: formatStorageDate(selectedDate),
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };

      await saveStoredNotes([newNote, ...notes]);
      router.back();
    } catch {
      Alert.alert("Hata", "Not kaydedilirken bir sorun oluştu.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <AppIconButton
              icon="chevron-back"
              onPress={() => router.back()}
              size={46}
              iconSize={23}
              iconColor={colors.white}
              backgroundColor={colors.panel}
              borderColor={colors.panelBorder}
              style={styles.backButton}
            />

            <AppIconButton
              icon="create-outline"
              onPress={() => {}}
              size={46}
              iconSize={23}
              iconColor={colors.purple}
              backgroundColor={colors.purpleSoft}
              borderColor={colors.purpleBorder}
            />
          </View>

          <View style={styles.hero}>
            <Text style={styles.title}>Yeni Not</Text>
            <Text style={styles.description}>
              Bugün veya ileri tarih için yapılacak not oluştur.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.purple}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>İleri tarihli not</Text>
              <Text style={styles.infoText}>
                Günü gelince notların arasında görünür.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Not Başlığı</Text>

              <View style={styles.inputWithIcon}>
                <Ionicons
                  name="text-outline"
                  size={18}
                  color={colors.muted}
                  style={styles.inputIcon}
                />

                <AppInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Örn: Market alışverişi"
                  height={58}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Açıklama</Text>

              <View style={[styles.inputWithIcon, styles.textAreaWithIcon]}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={colors.muted}
                  style={[styles.inputIcon, styles.textAreaIcon]}
                />

                <AppInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Not detayını yaz"
                  height={132}
                  multilineInput
                  multiline
                  style={[styles.input, styles.textArea]}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tarih</Text>

              <AppDateField
                value={formatDateTR(selectedDate)}
                onPress={() => setIsDatePickerVisible(true)}
                marginBottom={0}
              />

              <Text style={styles.helperText}>
                Tarih alanına tıklayarak notun gösterileceği günü seç.
              </Text>
            </View>

            <AppButton
              title="Notu Kaydet"
              onPress={handleSave}
              variant="purple"
              height={58}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>

        <AppDatePickerModal
          visible={isDatePickerVisible}
          value={selectedDate}
          onClose={() => setIsDatePickerVisible(false)}
          onConfirm={setSelectedDate}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  hero: {
    marginTop: 28,
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  description: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
  infoCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 26,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },
  infoText: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  card: {
    marginTop: 20,
    padding: 20,
    borderRadius: 34,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
  },
  inputWithIcon: {
    minHeight: 58,
    borderRadius: 21,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingRight: 15,
  },
  textAreaWithIcon: {
    minHeight: 132,
    alignItems: "flex-start",
  },
  textAreaIcon: {
    marginTop: 18,
  },
  textArea: {
    textAlignVertical: "top",
    paddingTop: 16,
  },
  helperText: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
  },
  saveButton: {
    borderRadius: 21,
    shadowColor: colors.purple,
    shadowOpacity: 0.42,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 9 },
    elevation: 8,
  },
});
