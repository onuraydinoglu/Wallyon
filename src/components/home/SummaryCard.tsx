import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";
import { formatCurrency } from "../../utils/formatCurrency";

type SummaryCardProps = {
  title: string;
  amount: number;
  dotColor: string;
  progressColor: string;
  progressWidth?: `${number}%`;
};

export default function SummaryCard({
  title,
  amount,
  dotColor,
  progressColor,
  progressWidth = "65%",
}: SummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTopRow}>
        <Text style={styles.summaryLabel}>{title}</Text>

        <View
          style={[
            styles.summaryDot,
            {
              backgroundColor: dotColor,
            },
          ]}
        />
      </View>

      <Text style={styles.summaryAmount}>{formatCurrency(amount)}</Text>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: progressWidth,
              backgroundColor: progressColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    flex: 1,
    minHeight: 130,
    borderRadius: 22,
    backgroundColor: colors.panel,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  summaryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    color: colors.label,
    fontSize: 12,
    fontWeight: "700",
  },
  summaryDot: {
    width: 11,
    height: 11,
    borderRadius: 999,
  },
  summaryAmount: {
    marginTop: 18,
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
  progressTrack: {
    height: 6,
    marginTop: 22,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(30, 41, 59, 0.9)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
});
