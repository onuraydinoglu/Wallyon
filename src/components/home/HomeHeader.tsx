import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";

type HomeHeaderProps = {
  name?: string;
};

export default function HomeHeader({ name }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.helloText}>Merhaba,</Text>

        <Text style={styles.welcomeText}>
          Hoş Geldin{name ? `, ${name}` : ""}!
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.8} style={styles.notificationButton}>
        <Ionicons name="notifications-outline" size={24} color={colors.white} />

        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>3</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  helloText: {
    color: colors.mutedLight,
    fontSize: 18,
    fontWeight: "500",
  },
  welcomeText: {
    marginTop: 4,
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: colors.panel,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.expense,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "800",
  },
});
