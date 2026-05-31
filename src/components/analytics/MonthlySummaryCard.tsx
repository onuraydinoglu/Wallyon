import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";
import { MonthlySummary } from "../../utils/analyticsHelpers";
import { formatCurrency } from "../../utils/formatCurrency";

type MonthlySummaryCardProps = {
  monthlyData: MonthlySummary[];
  selectedMonthKey: string | null;
  onSelectMonth: (monthKey: string) => void;
};

export default function MonthlySummaryCard({
  monthlyData,
  selectedMonthKey,
  onSelectMonth,
}: MonthlySummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleIcon}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={colors.purpleLight}
          />
        </View>

        <View style={styles.headerTextArea}>
          <Text style={styles.title}>Aylık Özet</Text>

          <Text style={styles.description}>
            Bir aya tıklayarak o aya ait tüm işlemleri görebilirsin.
          </Text>
        </View>
      </View>

      <View style={styles.monthList}>
        {monthlyData.map((item) => {
          const isSelected = selectedMonthKey === item.monthKey;
          const balanceColor =
            item.balance >= 0 ? colors.purpleLight : colors.expense;

          return (
            <TouchableOpacity
              key={item.monthKey}
              activeOpacity={0.85}
              style={[styles.monthRow, isSelected && styles.selectedMonthRow]}
              onPress={() => onSelectMonth(item.monthKey)}
            >
              <View
                style={[
                  styles.monthIconBox,
                  isSelected && styles.selectedMonthIconBox,
                ]}
              >
                <Ionicons
                  name={isSelected ? "calendar" : "calendar-outline"}
                  size={20}
                  color={isSelected ? colors.white : colors.purpleLight}
                />
              </View>

              <View style={styles.monthInfo}>
                <Text style={styles.monthName}>{item.monthLabel}</Text>

                <View style={styles.monthMetaRow}>
                  <Text style={styles.monthCount}>
                    {item.transactionCount} işlem
                  </Text>

                  <View style={styles.dot} />

                  <Text style={styles.monthSubText}>
                    Gelir / Gider / Yatırım
                  </Text>
                </View>
              </View>

              <View style={styles.monthRight}>
                <Text style={[styles.monthBalance, { color: balanceColor }]}>
                  {formatCurrency(item.balance)}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    isSelected && styles.selectedStatusBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      isSelected && styles.selectedStatusBadgeText,
                    ]}
                  >
                    {isSelected ? "Seçili" : "Detay"}
                  </Text>

                  <Ionicons
                    name={isSelected ? "checkmark" : "chevron-forward"}
                    size={13}
                    color={isSelected ? colors.white : colors.purpleLight}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {monthlyData.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="bar-chart-outline"
                size={26}
                color={colors.purpleLight}
              />
            </View>

            <Text style={styles.emptyStateTitle}>İşlem bulunamadı</Text>

            <Text style={styles.emptyStateText}>
              Gelir, gider veya yatırım eklediğinde aylık özet burada görünür.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    backgroundColor: colors.panel,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 18,
  },

  titleIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },

  headerTextArea: {
    flex: 1,
  },

  title: {
    color: colors.white,
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  description: {
    marginTop: 7,
    color: colors.label,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },

  monthList: {
    marginTop: 2,
    gap: 10,
  },

  monthRow: {
    minHeight: 82,
    borderRadius: 24,
    backgroundColor: "rgba(15, 23, 42, 0.52)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  selectedMonthRow: {
    backgroundColor: colors.purpleSoft,
    borderColor: colors.purpleBorder,
  },

  monthIconBox: {
    width: 46,
    height: 46,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.18)",
    marginRight: 12,
  },

  selectedMonthIconBox: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },

  monthInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },

  monthName: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },

  monthMetaRow: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
  },

  monthCount: {
    color: colors.label,
    fontSize: 12,
    fontWeight: "800",
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(148, 163, 184, 0.55)",
  },

  monthSubText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },

  monthRight: {
    alignItems: "flex-end",
    justifyContent: "center",
  },

  monthBalance: {
    fontSize: 17,
    fontWeight: "900",
  },

  statusBadge: {
    marginTop: 8,
    minHeight: 28,
    borderRadius: 999,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.16)",
  },

  selectedStatusBadge: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },

  statusBadgeText: {
    color: colors.purpleLight,
    fontSize: 11,
    fontWeight: "900",
  },

  selectedStatusBadgeText: {
    color: colors.white,
  },

  emptyState: {
    minHeight: 150,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 22,
  },

  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    marginBottom: 12,
  },

  emptyStateTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  emptyStateText: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 19,
  },
});
