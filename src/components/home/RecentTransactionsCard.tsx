import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../constants/theme";
import { Transaction } from "../../types/transaction";
import EmptyCard from "./EmptyCard";
import TransactionItem from "./TransactionItem";

type RecentTransactionsCardProps = {
  todayText: string;
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: number) => void;
};

export default function RecentTransactionsCard({
  todayText,
  transactions,
  onEdit,
  onDelete,
}: RecentTransactionsCardProps) {
  const isEmpty = transactions.length === 0;

  return (
    <View style={styles.transactionsCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Son İşlemler</Text>
        <Text style={styles.todayText}>{todayText}</Text>
      </View>

      {isEmpty ? (
        <EmptyCard
          icon="receipt-outline"
          title="Henüz işlem yok"
          description="Gelir, gider veya yatırım eklediğinde son işlemlerin burada listelenir."
        />
      ) : (
        transactions.map((item) => (
          <TransactionItem
            key={item.id}
            transaction={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  transactionsCard: {
    marginTop: 24,
    borderRadius: 30,
    backgroundColor: colors.panel,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },

  sectionHeader: {
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
  },

  todayText: {
    color: colors.label,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    flexShrink: 1,
  },
});
