import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/theme";
import { getStoredNotes, saveStoredNotes } from "../services/noteStorage";
import { Note } from "../types/note";

const getTodayKey = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export default function AddNoteScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [noteDate, setNoteDate] = useState(getTodayKey());

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Uyarı", "Not başlığı boş olamaz.");
      return;
    }

    const notes = await getStoredNotes();

    const newNote: Note = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      date: noteDate.trim() || getTodayKey(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    await saveStoredNotes([newNote, ...notes]);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.title}>Yeni Not</Text>
        <Text style={styles.description}>
          Bugün veya ileri tarih için yapılacak not ekle.
        </Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Not başlığı"
            placeholderTextColor={colors.muted}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Açıklama"
            placeholderTextColor={colors.muted}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.muted}
            value={noteDate}
            onChangeText={setNoteDate}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark" size={20} color={colors.white} />
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 20 },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.panel,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  title: {
    marginTop: 24,
    color: colors.white,
    fontSize: 32,
    fontWeight: "900",
  },
  description: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    marginTop: 24,
    padding: 18,
    borderRadius: 30,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  input: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 15,
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 14,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 15,
    textAlignVertical: "top",
  },
  saveButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.purple,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
});
