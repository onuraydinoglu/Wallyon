import { useMemo, useState } from "react";
import { View } from "react-native";

import { MonthlySummary } from "../../utils/analyticsHelpers";
import MonthlyBalanceBox from "./monthly-summary/MonthlyBalanceBox";
import MonthlyEmptyState from "./monthly-summary/MonthlyEmptyState";
import MonthlyFilterModal from "./monthly-summary/MonthlyFilterModal";
import MonthlySummaryBadges from "./monthly-summary/MonthlySummaryBadges";
import MonthlySummaryHeader from "./monthly-summary/MonthlySummaryHeader";
import MonthlySummaryTotals from "./monthly-summary/MonthlySummaryTotals";
import {
  getMonthNumber,
  getYear,
} from "./monthly-summary/monthlySummaryHelpers";
import { styles } from "./monthly-summary/monthlySummaryStyles";

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
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const selectedMonthData =
    monthlyData.find((item) => item.monthKey === selectedMonthKey) || null;

  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(monthlyData.map((item) => getYear(item.monthLabel))),
    );

    return uniqueYears.sort((a, b) => b - a);
  }, [monthlyData]);

  const [selectedFilterYear, setSelectedFilterYear] = useState<number | null>(
    years[0] || null,
  );

  const activeFilterYear =
    selectedFilterYear ||
    getYear(selectedMonthData?.monthLabel || "") ||
    years[0];

  const filteredMonths = useMemo(() => {
    return monthlyData
      .filter((item) => getYear(item.monthLabel) === activeFilterYear)
      .sort(
        (a, b) => getMonthNumber(b.monthLabel) - getMonthNumber(a.monthLabel),
      );
  }, [monthlyData, activeFilterYear]);

  const handleOpenFilter = () => {
    if (selectedMonthData) {
      setSelectedFilterYear(getYear(selectedMonthData.monthLabel));
    } else if (years.length > 0) {
      setSelectedFilterYear(years[0]);
    }

    setIsFilterVisible(true);
  };

  const handleSelectMonth = (monthKey: string) => {
    onSelectMonth(monthKey);
    setIsFilterVisible(false);
  };

  return (
    <>
      <View style={styles.card}>
        <MonthlySummaryHeader
          selectedMonthLabel={selectedMonthData?.monthLabel || "Ay seçilmedi"}
          onOpenFilter={handleOpenFilter}
        />

        <MonthlySummaryBadges
          selectedTransactionCount={selectedMonthData?.transactionCount || 0}
          totalMonthCount={monthlyData.length}
        />

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.divider} />

        <MonthlySummaryTotals
          totalIncome={selectedMonthData?.totalIncome || 0}
          totalExpense={selectedMonthData?.totalExpense || 0}
          totalInvestment={selectedMonthData?.totalInvestment || 0}
        />

        <MonthlyBalanceBox balance={selectedMonthData?.balance || 0} />

        {monthlyData.length === 0 && <MonthlyEmptyState />}
      </View>

      <MonthlyFilterModal
        visible={isFilterVisible}
        years={years}
        activeFilterYear={activeFilterYear}
        filteredMonths={filteredMonths}
        selectedMonthKey={selectedMonthKey}
        onClose={() => setIsFilterVisible(false)}
        onSelectYear={setSelectedFilterYear}
        onSelectMonth={handleSelectMonth}
      />
    </>
  );
}
