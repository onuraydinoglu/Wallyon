import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import { getStoredNotes, saveStoredNotes } from "../../services/noteStorage";
import { Note } from "../../types/note";

const getTodayKey = () => new Date().toISOString().split("T")[0];

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadNotes = async () => {
        const storedNotes = await getStoredNotes();
        setNotes(storedNotes);
      };

      loadNotes();
    }, []),
  );

  const todayNotes = useMemo(() => {
    const today = getTodayKey();
    return notes.filter((note) => note.date <= today);
  }, [notes]);

  const futureNotes = useMemo(() => {
    const today = getTodayKey();
    return notes.filter((note) => note.date > today);
  }, [notes]);

  const toggleNote = async (noteId: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, isCompleted: !note.isCompleted } : note,
    );

    setNotes(updatedNotes);
    await saveStoredNotes(updatedNotes);
  };

  const renderNote = (note: Note) => (
    <TouchableOpacity
      key={note.id}
      style={styles.noteCard}
      activeOpacity={0.8}
      onPress={() => toggleNote(note.id)}
    >
      <View
        style={[styles.checkBox, note.isCompleted && styles.checkBoxCompleted]}
      >
        {note.isCompleted && (
          <Ionicons name="checkmark" size={17} color={colors.white} />
        )}
      </View>

      <View style={styles.noteContent}>
        <Text
          style={[
            styles.noteTitle,
            note.isCompleted && styles.noteTitleCompleted,
          ]}
        >
          {note.title}
        </Text>

        {!!note.description && (
          <Text style={styles.noteDescription}>{note.description}</Text>
        )}

        <View style={styles.dateBadge}>
          <Ionicons name="calendar-outline" size={13} color={colors.muted} />
          <Text style={styles.dateText}>{note.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.pageTitle}>Notlarım</Text>
              <Text style={styles.pageDescription}>
                Bugün yapılacaklar ve ileri tarihli notlar.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addMiniButton}
              onPress={() => router.push("/add-note")}
            >
              <Ionicons name="add" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryValue}>{todayNotes.length}</Text>
              <Text style={styles.summaryLabel}>Günün Notu</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View>
              <Text style={styles.summaryValue}>{futureNotes.length}</Text>
              <Text style={styles.summaryLabel}>İleri Tarih</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Günün Notları</Text>

            {todayNotes.length > 0 ? (
              todayNotes.map(renderNote)
            ) : (
              <Text style={styles.emptyText}>Bugün için not yok.</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İleri Tarihli Notlar</Text>

            {futureNotes.length > 0 ? (
              futureNotes.map(renderNote)
            ) : (
              <Text style={styles.emptyText}>İleri tarihli not yok.</Text>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.push("/add-note")}
        >
          <Ionicons name="add" size={30} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  wrapper: { flex: 1 },
  container: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  header: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageTitle: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "900",
  },
  pageDescription: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  addMiniButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    marginTop: 22,
    padding: 18,
    borderRadius: 30,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryValue: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },
  summaryLabel: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.panelBorder,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 12,
  },
  noteCard: {
    marginBottom: 12,
    padding: 15,
    borderRadius: 24,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkBox: {
    width: 30,
    height: 30,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    backgroundColor: colors.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  checkBoxCompleted: {
    backgroundColor: colors.income,
    borderColor: colors.incomeBorder,
  },
  noteContent: { flex: 1 },
  noteTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
  noteTitleCompleted: {
    color: colors.muted,
    textDecorationLine: "line-through",
  },
  noteDescription: {
    marginTop: 5,
    color: colors.mutedLight,
    fontSize: 12,
    fontWeight: "600",
  },
  dateBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dateText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  floatingButton: {
    position: "absolute",
    right: 22,
    bottom: 24,
    width: 62,
    height: 62,
    borderRadius: 24,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
});
