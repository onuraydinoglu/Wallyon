import { StyleSheet, View } from "react-native";

import { colors } from "../../constants/theme";
import SummaryCard from "./SummaryCard";

type HomeSummarySectionProps = {
  currentMonthIncome: number;
  currentMonthExpense: number;
  currentMonthInvestment: number;
};

export default function HomeSummarySection({
  currentMonthIncome,
  currentMonthExpense,
  currentMonthInvestment,
}: HomeSummarySectionProps) {
  return (
    <View style={styles.summaryGrid}>
      <SummaryCard
        title="Toplam Gelir"
        amount={currentMonthIncome}
        dotColor={colors.income}
        progressColor={colors.income}
        progressWidth="72%"
      />

      <SummaryCard
        title="Toplam Gider"
        amount={currentMonthExpense}
        dotColor={colors.expense}
        progressColor={colors.expense}
        progressWidth="55%"
      />

      <SummaryCard
        title="Toplam Yatırım"
        amount={currentMonthInvestment}
        dotColor={colors.investment}
        progressColor={colors.investment}
        progressWidth="68%"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  summaryGrid: {
    marginTop: 18,
    flexDirection: "row",
    gap: 10,
  },
});
