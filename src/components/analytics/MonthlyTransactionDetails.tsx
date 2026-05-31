import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";
import { MonthlySummary } from "../../utils/analyticsHelpers";
import { formatCurrency } from "../../utils/formatCurrency";
import TransactionItem from "../home/TransactionItem";

type MonthlyTransactionDetailsProps = {
  selectedMonthData: MonthlySummary | null;
};

export default function MonthlyTransactionDetails({
  selectedMonthData,
}: MonthlyTransactionDetailsProps) {
  if (!selectedMonthData) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{selectedMonthData.monthLabel}</Text>

          <Text style={styles.description}>
            Bu ay yapılan işlemler son işlemler görünümünde listelenir.
          </Text>
        </View>
      </View>

      <View style={styles.summaryGrid}>
        <View
          style={[
            styles.summaryBox,
            {
              backgroundColor: colors.incomeSoft,
              borderColor: colors.incomeBorder,
            },
          ]}
        >
          <Text style={styles.summaryLabel}>Gelir</Text>

          <Text style={[styles.summaryValue, { color: colors.income }]}>
            + {formatCurrency(selectedMonthData.totalIncome)}
          </Text>
        </View>

        <View
          style={[
            styles.summaryBox,
            {
              backgroundColor: colors.expenseSoft,
              borderColor: colors.expenseBorder,
            },
          ]}
        >
          <Text style={styles.summaryLabel}>Gider</Text>

          <Text style={[styles.summaryValue, { color: colors.expense }]}>
            - {formatCurrency(selectedMonthData.totalExpense)}
          </Text>
        </View>

        <View
          style={[
            styles.summaryBox,
            {
              backgroundColor: colors.investmentSoft,
              borderColor: colors.investmentBorder,
            },
          ]}
        >
          <Text style={styles.summaryLabel}>Yatırım</Text>

          <Text style={[styles.summaryValue, { color: colors.investment }]}>
            - {formatCurrency(selectedMonthData.totalInvestment)}
          </Text>
        </View>

        <View
          style={[
            styles.summaryBox,
            {
              backgroundColor: colors.purpleSoft,
              borderColor: colors.purpleBorder,
            },
          ]}
        >
          <Text style={styles.summaryLabel}>Kalan</Text>

          <Text
            style={[
              styles.summaryValue,
              {
                color:
                  selectedMonthData.balance >= 0
                    ? colors.purpleLight
                    : colors.expense,
              },
            ]}
          >
            {formatCurrency(selectedMonthData.balance)}
          </Text>
        </View>
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={styles.transactionsTitle}>Aylık İşlemler</Text>

        <Text style={styles.transactionsCount}>
          {selectedMonthData.transactionCount} işlem
        </Text>
      </View>

      <View style={styles.transactionsList}>
        {selectedMonthData.transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            showActions={false}
          />
        ))}
      </View>

      {selectedMonthData.transactions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>İşlem bulunamadı</Text>

          <Text style={styles.emptyStateText}>
            Bu ay için kayıtlı işlem bulunmuyor.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
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

  summaryGrid: {
    flexDirection: "row",
    gap: 8,
  },

  summaryBox: {
    flex: 1,
    borderRadius: 18,
    paddingHorizontal: 1,
    paddingVertical: 14,
    borderWidth: 1,
  },

  summaryLabel: {
    color: colors.label,
    fontSize: 12,
    fontWeight: "800",
  },

  summaryValue: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "900",
  },

  transactionsHeader: {
    marginTop: 24,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  transactionsTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  transactionsCount: {
    color: colors.purpleLight,
    fontSize: 12,
    fontWeight: "800",
  },

  transactionsList: {
    marginTop: 2,
  },

  emptyState: {
    minHeight: 100,
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
