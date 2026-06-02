import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
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
import { formatDateTR } from "../../utils/dateUtils";

type NoteGroup = {
  date: string;
  notes: Note[];
};

const getTodayKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatNoteDate = (dateKey: string) => {
  return formatDateTR(parseDateKey(dateKey));
};

const getNoteBadgeText = (dateKey: string) => {
  if (dateKey === getTodayKey()) return "Bugün";

  return formatNoteDate(dateKey);
};

const getCompletedCount = (notes: Note[]) => {
  return notes.filter((note) => note.isCompleted).length;
};

const groupNotesByDate = (notes: Note[]) => {
  const groupedNotes = notes.reduce<Record<string, Note[]>>((groups, note) => {
    if (!groups[note.date]) {
      groups[note.date] = [];
    }

    groups[note.date].push(note);

    return groups;
  }, {});

  return Object.entries(groupedNotes)
    .map(([date, groupedDateNotes]) => ({
      date,
      notes: groupedDateNotes.sort(
        (a, b) => Number(a.isCompleted) - Number(b.isCompleted),
      ),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  useFocusEffect(
    useCallback(() => {
      const loadNotes = async () => {
        try {
          const storedNotes = await getStoredNotes();
          setNotes(storedNotes);
        } catch {
          Alert.alert("Hata", "Notlar yüklenirken bir sorun oluştu.");
        }
      };

      loadNotes();
    }, []),
  );

  const todayNotes = useMemo(() => {
    const today = getTodayKey();

    return notes
      .filter((note) => note.date <= today)
      .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }, [notes]);

  const futureNotes = useMemo(() => {
    const today = getTodayKey();

    return notes.filter((note) => note.date > today);
  }, [notes]);

  const futureNoteGroups = useMemo(() => {
    return groupNotesByDate(futureNotes);
  }, [futureNotes]);

  const completedTodayCount = useMemo(() => {
    return getCompletedCount(todayNotes);
  }, [todayNotes]);

  const progressPercent = useMemo(() => {
    if (todayNotes.length === 0) return 0;

    return Math.round((completedTodayCount / todayNotes.length) * 100);
  }, [completedTodayCount, todayNotes.length]);

  const toggleFutureGroup = (date: string) => {
    setExpandedGroups((currentGroups) => ({
      ...currentGroups,
      [date]: !currentGroups[date],
    }));
  };

  const toggleNote = async (noteId: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, isCompleted: !note.isCompleted } : note,
    );

    setNotes(updatedNotes);

    try {
      await saveStoredNotes(updatedNotes);
    } catch {
      Alert.alert("Hata", "Not güncellenirken bir sorun oluştu.");
    }
  };

  const deleteNote = (noteId: number) => {
    Alert.alert("Notu Sil", "Bu notu silmek istiyor musun?", [
      {
        text: "Vazgeç",
        style: "cancel",
      },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          const updatedNotes = notes.filter((note) => note.id !== noteId);
          setNotes(updatedNotes);

          try {
            await saveStoredNotes(updatedNotes);
          } catch {
            Alert.alert("Hata", "Not silinirken bir sorun oluştu.");
          }
        },
      },
    ]);
  };

  const renderEmptyState = (title: string, description: string) => {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name="checkmark-done-outline"
            size={26}
            color={colors.purple}
          />
        </View>

        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyDescription}>{description}</Text>
      </View>
    );
  };

  const renderNote = (note: Note, type: "today" | "future") => {
    const isFuture = type === "future";

    return (
      <TouchableOpacity
        key={note.id}
        style={[styles.noteCard, note.isCompleted && styles.noteCardCompleted]}
        activeOpacity={0.85}
        onPress={() => toggleNote(note.id)}
      >
        <View style={styles.noteLeft}>
          <View
            style={[
              styles.checkBox,
              note.isCompleted && styles.checkBoxCompleted,
            ]}
          >
            {note.isCompleted ? (
              <Ionicons name="checkmark" size={17} color={colors.white} />
            ) : null}
          </View>

          <View style={styles.line} />
        </View>

        <View style={styles.noteContent}>
          <View style={styles.noteHeader}>
            <View
              style={[
                styles.statusBadge,
                isFuture ? styles.futureBadge : styles.todayBadge,
              ]}
            >
              <Ionicons
                name={isFuture ? "time-outline" : "sunny-outline"}
                size={12}
                color={isFuture ? colors.purpleLight : colors.income}
              />

              <Text
                style={[
                  styles.statusBadgeText,
                  isFuture ? styles.futureBadgeText : styles.todayBadgeText,
                ]}
              >
                {getNoteBadgeText(note.date)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.8}
              onPress={() => deleteNote(note.id)}
            >
              <Ionicons name="trash-outline" size={17} color={colors.expense} />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.noteTitle,
              note.isCompleted && styles.noteTitleCompleted,
            ]}
            numberOfLines={2}
          >
            {note.title}
          </Text>

          {note.description ? (
            <Text style={styles.noteDescription} numberOfLines={2}>
              {note.description}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFutureNoteGroup = (group: NoteGroup) => {
    const isExpanded = expandedGroups[group.date];

    return (
      <View key={group.date} style={styles.dateGroup}>
        <TouchableOpacity
          style={[
            styles.dateGroupHeader,
            isExpanded && styles.dateGroupHeaderActive,
          ]}
          activeOpacity={0.85}
          onPress={() => toggleFutureGroup(group.date)}
        >
          <View style={styles.dateGroupIcon}>
            <Ionicons name="calendar-outline" size={15} color={colors.purple} />
          </View>

          <View style={styles.dateGroupTextWrapper}>
            <Text style={styles.dateGroupTitle}>
              {formatNoteDate(group.date)}
            </Text>
            <Text style={styles.dateGroupDescription}>
              {group.notes.length} not planlandı
            </Text>
          </View>

          <View style={styles.dateGroupRight}>
            <Text style={styles.dateGroupCount}>{group.notes.length}</Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.muted}
            />
          </View>
        </TouchableOpacity>

        {isExpanded ? (
          <View style={styles.dateGroupContent}>
            {group.notes.map((note) => renderNote(note, "future"))}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerTextWrapper}>
              <Text style={styles.pageTitle}>Yapılacaklar</Text>
              <Text style={styles.pageDescription}>
                Bugünkü notlarını takip et, planlarını tarihe göre düzenle.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.headerAddButton}
              activeOpacity={0.85}
              onPress={() => router.push("./add-note")}
            >
              <Ionicons name="add" size={25} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroLabel}>Bugünkü ilerleme</Text>
                <Text style={styles.heroTitle}>
                  {completedTodayCount}/{todayNotes.length} tamamlandı
                </Text>
              </View>

              <View style={styles.progressCircle}>
                <Text style={styles.progressText}>%{progressPercent}</Text>
              </View>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progressPercent}%` }]}
              />
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, styles.todayStatIcon]}>
                  <Ionicons
                    name="today-outline"
                    size={18}
                    color={colors.income}
                  />
                </View>
                <Text style={styles.statValue}>{todayNotes.length}</Text>
                <Text style={styles.statLabel}>Günün Notu</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <View style={[styles.statIcon, styles.futureStatIcon]}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={colors.purple}
                  />
                </View>
                <Text style={styles.statValue}>{futureNotes.length}</Text>
                <Text style={styles.statLabel}>Planlı Not</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <View style={[styles.statIcon, styles.doneStatIcon]}>
                  <Ionicons
                    name="checkmark-done-outline"
                    size={18}
                    color={colors.income}
                  />
                </View>
                <Text style={styles.statValue}>{completedTodayCount}</Text>
                <Text style={styles.statLabel}>Tamamlandı</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Günün Notları</Text>
              <Text style={styles.sectionCount}>{todayNotes.length}</Text>
            </View>

            {todayNotes.length > 0
              ? todayNotes.map((note) => renderNote(note, "today"))
              : renderEmptyState(
                  "Bugün için not yok",
                  "Yeni bir yapılacak ekleyerek günü planlamaya başlayabilirsin.",
                )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Planlanan Notlar</Text>
              <Text style={styles.sectionCount}>{futureNotes.length}</Text>
            </View>

            {futureNoteGroups.length > 0
              ? futureNoteGroups.map(renderFutureNoteGroup)
              : renderEmptyState(
                  "Planlanmış not yok",
                  "İleri tarihli bir iş eklediğinde tarihine göre burada görünecek.",
                )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  wrapper: {
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
  headerTextWrapper: {
    flex: 1,
    paddingRight: 16,
  },
  pageTitle: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.7,
  },
  pageDescription: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  headerAddButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.purple,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  heroCard: {
    marginTop: 24,
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
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },
  heroTitle: {
    marginTop: 5,
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  progressCircle: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    color: colors.purpleLight,
    fontSize: 15,
    fontWeight: "900",
  },
  progressBar: {
    marginTop: 18,
    height: 9,
    borderRadius: 999,
    backgroundColor: colors.background,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.purple,
  },
  statsRow: {
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  todayStatIcon: {
    backgroundColor: colors.incomeSoft,
    borderWidth: 1,
    borderColor: colors.incomeBorder,
  },
  futureStatIcon: {
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  doneStatIcon: {
    backgroundColor: colors.incomeSoft,
    borderWidth: 1,
    borderColor: colors.incomeBorder,
  },
  statValue: {
    color: colors.white,
    fontSize: 19,
    fontWeight: "900",
  },
  statLabel: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: colors.panelBorder,
  },
  section: {
    marginTop: 26,
  },
  sectionHeader: {
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  sectionCount: {
    minWidth: 32,
    height: 28,
    borderRadius: 999,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    color: colors.mutedLight,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    fontWeight: "900",
    paddingTop: 5,
  },
  dateGroup: {
    marginBottom: 13,
  },
  dateGroupHeader: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
  },
  dateGroupHeaderActive: {
    borderColor: colors.purpleBorder,
    backgroundColor: colors.purpleSoft,
  },
  dateGroupIcon: {
    width: 34,
    height: 34,
    borderRadius: 13,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  dateGroupTextWrapper: {
    flex: 1,
  },
  dateGroupTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
  },
  dateGroupDescription: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  dateGroupRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateGroupCount: {
    minWidth: 26,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.background,
    color: colors.mutedLight,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 11,
    fontWeight: "900",
    paddingTop: 4,
  },
  dateGroupContent: {
    marginTop: 10,
  },
  noteCard: {
    marginBottom: 13,
    padding: 15,
    borderRadius: 28,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOpacity: 0.11,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  noteCardCompleted: {
    opacity: 0.68,
  },
  noteLeft: {
    width: 34,
    alignItems: "center",
    marginRight: 12,
  },
  checkBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    backgroundColor: colors.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxCompleted: {
    backgroundColor: colors.income,
    borderColor: colors.incomeBorder,
  },
  line: {
    flex: 1,
    width: 1,
    marginTop: 8,
    backgroundColor: colors.panelBorder,
  },
  noteContent: {
    flex: 1,
  },
  noteHeader: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    height: 27,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
  },
  todayBadge: {
    backgroundColor: colors.incomeSoft,
    borderWidth: 1,
    borderColor: colors.incomeBorder,
  },
  futureBadge: {
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  statusBadgeText: {
    marginLeft: 5,
    fontSize: 10,
    fontWeight: "900",
  },
  todayBadgeText: {
    color: colors.income,
  },
  futureBadgeText: {
    color: colors.purpleLight,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 13,
    backgroundColor: colors.expenseSoft,
    borderWidth: 1,
    borderColor: colors.expenseBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  noteTitle: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
  },
  noteTitleCompleted: {
    color: colors.muted,
    textDecorationLine: "line-through",
  },
  noteDescription: {
    marginTop: 7,
    color: colors.mutedLight,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  emptyCard: {
    padding: 22,
    borderRadius: 28,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: "center",
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
  emptyDescription: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});
