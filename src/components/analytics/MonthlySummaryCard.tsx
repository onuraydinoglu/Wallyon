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
        <View>
          <Text style={styles.title}>Aylık Özet</Text>

          <Text style={styles.description}>
            Bir aya tıklayarak o aya ait tüm işlemleri görebilirsin.
          </Text>
        </View>
      </View>

      <View style={styles.monthList}>
        {monthlyData.map((item) => {
          const isSelected = selectedMonthKey === item.monthKey;

          return (
            <TouchableOpacity
              key={item.monthKey}
              activeOpacity={0.85}
              style={[styles.monthRow, isSelected && styles.selectedMonthRow]}
              onPress={() => onSelectMonth(item.monthKey)}
            >
              <View style={styles.monthLeft}>
                <Text style={styles.monthName}>{item.monthLabel}</Text>

                <Text style={styles.monthCount}>
                  {item.transactionCount} işlem
                </Text>
              </View>

              <View style={styles.monthRight}>
                <Text
                  style={[
                    styles.monthBalance,
                    {
                      color:
                        item.balance >= 0 ? colors.purpleLight : colors.expense,
                    },
                  ]}
                >
                  {formatCurrency(item.balance)}
                </Text>

                <Text style={styles.monthDetailText}>
                  {isSelected ? "Seçili" : "Detay"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {monthlyData.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>İşlem bulunamadı</Text>

            <Text style={styles.emptyStateText}>
              Gelir, gider veya yatırım eklediğinde aylık özet burada görünecek.
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
    marginBottom: 18,
  },

  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
  },

  description: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },

  monthList: {
    marginTop: 4,
  },

  monthRow: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedMonthRow: {
    marginHorizontal: -10,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },

  monthLeft: {
    flex: 1,
    paddingRight: 12,
  },

  monthName: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },

  monthCount: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },

  monthRight: {
    alignItems: "flex-end",
  },

  monthBalance: {
    fontSize: 15,
    fontWeight: "900",
  },

  monthDetailText: {
    marginTop: 5,
    color: colors.purpleLight,
    fontSize: 11,
    fontWeight: "800",
  },

  emptyState: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 20,
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
