import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";
import AppIconButton from "../ui/AppIconButton";

type NotesHeaderProps = {
  onAddPress: () => void;
};

export default function NotesHeader({ onAddPress }: NotesHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTextWrapper}>
        <Text style={styles.pageTitle}>Yapılacaklar</Text>

        <Text style={styles.pageDescription}>
          Bugünkü notlarını takip et, planlarını tarihe göre düzenle.
        </Text>
      </View>

      <AppIconButton
        icon="add"
        onPress={onAddPress}
        size={50}
        iconSize={25}
        iconColor={colors.white}
        backgroundColor={colors.purple}
        borderColor={colors.purple}
        style={styles.headerAddButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 18,
    shadowColor: colors.purple,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
});
