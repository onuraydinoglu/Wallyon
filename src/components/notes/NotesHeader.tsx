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
        icon="create-outline"
        onPress={onAddPress}
        size={50}
        iconSize={25}
        iconColor={colors.purpleLight}
        backgroundColor={colors.purpleSoft}
        borderColor={colors.purpleBorder}
        style={styles.headerAddButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-start",
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
    borderRadius: 14,
  },
});
