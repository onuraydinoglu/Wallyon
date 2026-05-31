import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";
import { Transaction, TransactionType } from "../../types/transaction";
import { formatCurrency } from "../../utils/formatCurrency";

type TransactionItemProps = {
  transaction: Transaction;
};

const getTransactionIcon = (
  type: TransactionType,
): keyof typeof Ionicons.glyphMap => {
  if (type === "income") return "trending-up";
  if (type === "expense") return "trending-down";
  return "business";
};

const getTransactionColor = (type: TransactionType) => {
  if (type === "income") return colors.income;
  if (type === "expense") return colors.expense;
  return colors.investment;
};

const getTransactionBgColor = (type: TransactionType) => {
  if (type === "income") return colors.incomeSoft;
  if (type === "expense") return colors.expenseSoft;
  return colors.investmentSoft;
};

const getAmountPrefix = (type: TransactionType) => {
  if (type === "income") return "+";
  return "-";
};

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const transactionColor = getTransactionColor(transaction.type);

  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            {
              backgroundColor: getTransactionBgColor(transaction.type),
            },
          ]}
        >
          <Ionicons
            name={getTransactionIcon(transaction.type)}
            size={20}
            color={transactionColor}
          />
        </View>

        <View>
          <Text style={styles.transactionTitle}>{transaction.title}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
      </View>

      <Text
        style={[
          styles.transactionAmount,
          {
            color: transactionColor,
          },
        ]}
      >
        {getAmountPrefix(transaction.type)}
        {formatCurrency(transaction.amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.08)",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 46,
    height: 46,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transactionTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
  transactionDate: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "900",
  },
});
