import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActionButton from "../../components/home/ActionButton";
import BalanceCard from "../../components/home/BalanceCard";
import HomeHeader from "../../components/home/HomeHeader";
import SummaryCard from "../../components/home/SummaryCard";
import TransactionItem from "../../components/home/TransactionItem";
import IncomeFieldsModal from "../../components/transaction/IncomeFieldsModal";
import IncomeTransactionModal from "../../components/transaction/IncomeTransactionModal";
import { colors } from "../../constants/theme";
import { defaultIncomeFields } from "../../data/incomeFields";
import { transactions as initialTransactions } from "../../data/transactions";
import { Transaction } from "../../types/transaction";

export default function HomeScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();

  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  const [incomeFields, setIncomeFields] =
    useState<string[]>(defaultIncomeFields);

  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isIncomeFieldsModalVisible, setIsIncomeFieldsModalVisible] =
    useState(false);

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const totalInvestment = transactions
    .filter((item) => item.type === "investment")
    .reduce((total, item) => total + item.amount, 0);

  const remainingBalance = totalIncome - totalExpense - totalInvestment;

  const handleSaveIncome = (transaction: Transaction) => {
    setTransactions((currentTransactions) => [
      transaction,
      ...currentTransactions,
    ]);
  };

  const handleAddIncomeField = (fieldName: string) => {
    setIncomeFields((currentFields) => {
      const isAlreadyExists = currentFields.some(
        (field) => field.toLowerCase() === fieldName.toLowerCase(),
      );

      if (isAlreadyExists) {
        return currentFields;
      }

      return [...currentFields, fieldName];
    });
  };

  const handleDeleteIncomeField = (fieldName: string) => {
    setIncomeFields((currentFields) =>
      currentFields.filter((field) => field !== fieldName),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <HomeHeader name={name} />

        <BalanceCard remainingBalance={remainingBalance} />

        <View style={styles.summaryGrid}>
          <SummaryCard
            title="Toplam Gelir"
            amount={totalIncome}
            dotColor={colors.income}
            progressColor={colors.income}
            progressWidth="72%"
          />

          <SummaryCard
            title="Toplam Gider"
            amount={totalExpense}
            dotColor={colors.expense}
            progressColor={colors.expense}
            progressWidth="55%"
          />

          <SummaryCard
            title="Toplam Yatırım"
            amount={totalInvestment}
            dotColor={colors.investment}
            progressColor={colors.investment}
            progressWidth="68%"
          />
        </View>

        <View style={styles.actionRow}>
          <ActionButton
            title="Gelir"
            icon="trending-up"
            color={colors.income}
            iconBackgroundColor={colors.incomeSoft}
            borderColor={colors.incomeBorder}
            onPress={() => setIsIncomeModalVisible(true)}
          />

          <ActionButton
            title="Gider"
            icon="trending-down"
            color={colors.expense}
            iconBackgroundColor={colors.expenseSoft}
            borderColor={colors.expenseBorder}
          />

          <ActionButton
            title="Yatırım"
            icon="business"
            color={colors.investment}
            iconBackgroundColor={colors.investmentSoft}
            borderColor={colors.investmentBorder}
          />

          <ActionButton
            title="Daha Fazla"
            icon="ellipsis-horizontal"
            color={colors.purpleLight}
            iconBackgroundColor={colors.purpleSoft}
            borderColor={colors.panelBorder}
          />
        </View>

        <View style={styles.transactionsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Son İşlemler</Text>

            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((item) => (
            <TransactionItem key={item.id} transaction={item} />
          ))}
        </View>
      </ScrollView>

      <IncomeTransactionModal
        visible={isIncomeModalVisible}
        incomeFields={incomeFields}
        onClose={() => setIsIncomeModalVisible(false)}
        onOpenFieldsModal={() => setIsIncomeFieldsModalVisible(true)}
        onSave={handleSaveIncome}
      />

      <IncomeFieldsModal
        visible={isIncomeFieldsModalVisible}
        fields={incomeFields}
        onClose={() => setIsIncomeFieldsModalVisible(false)}
        onAddField={handleAddIncomeField}
        onDeleteField={handleDeleteIncomeField}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  summaryGrid: {
    marginTop: 18,
    flexDirection: "row",
    gap: 10,
  },
  actionRow: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
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
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
  },
  seeAllText: {
    color: colors.purpleLight,
    fontSize: 13,
    fontWeight: "800",
  },
});
