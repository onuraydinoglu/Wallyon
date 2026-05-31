import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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

import ExpenseFieldsModal from "../../components/transaction/ExpenseFieldsModal";
import ExpenseTransactionModal from "../../components/transaction/ExpenseTransactionModal";
import IncomeFieldsModal from "../../components/transaction/IncomeFieldsModal";
import IncomeTransactionModal from "../../components/transaction/IncomeTransactionModal";
import InvestmentFieldsModal from "../../components/transaction/InvestmentFieldsModal";
import InvestmentTransactionModal from "../../components/transaction/InvestmentTransactionModal";

import { colors } from "../../constants/theme";
import { defaultExpenseFields } from "../../data/expenseFields";
import { defaultIncomeFields } from "../../data/incomeFields";
import { defaultInvestmentFields } from "../../data/investmentFields";
import { transactions as initialTransactions } from "../../data/transactions";
import { Transaction } from "../../types/transaction";

type MonthlyIncomeSummary = {
  monthKey: string;
  monthLabel: string;
  totalIncome: number;
  transactionCount: number;
};

const TRANSACTIONS_STORAGE_KEY = "WALLYON_TRANSACTIONS";

const turkishMonths: Record<string, string> = {
  ocak: "01",
  şubat: "02",
  subat: "02",
  mart: "03",
  nisan: "04",
  mayıs: "05",
  mayis: "05",
  haziran: "06",
  temmuz: "07",
  ağustos: "08",
  agustos: "08",
  eylül: "09",
  eylul: "09",
  ekim: "10",
  kasım: "11",
  kasim: "11",
  aralık: "12",
  aralik: "12",
};

const monthLabels: Record<string, string> = {
  "01": "Ocak",
  "02": "Şubat",
  "03": "Mart",
  "04": "Nisan",
  "05": "Mayıs",
  "06": "Haziran",
  "07": "Temmuz",
  "08": "Ağustos",
  "09": "Eylül",
  "10": "Ekim",
  "11": "Kasım",
  "12": "Aralık",
};

const normalizeText = (value: string) => {
  return value.trim().toLocaleLowerCase("tr-TR").replace(",", "");
};

const getTransactionMonthKey = (dateText: string) => {
  if (!dateText) return "";

  const numericDateMatch = dateText.match(
    /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/,
  );

  if (numericDateMatch) {
    const month = numericDateMatch[2].padStart(2, "0");
    const year = numericDateMatch[3];

    return `${year}-${month}`;
  }

  const parsedDate = new Date(dateText);

  if (!Number.isNaN(parsedDate.getTime())) {
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
  }

  const parts = dateText.split(" ").filter(Boolean);

  if (parts.length >= 3) {
    const monthText = normalizeText(parts[1]);
    const month = turkishMonths[monthText];
    const year = parts[2];

    if (!month || !year) return "";

    return `${year}-${month}`;
  }

  return "";
};

const getCurrentMonthKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

const getMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split("-");
  const monthLabel = monthLabels[month] || "Bilinmeyen Ay";

  return `${monthLabel} ${year}`;
};

export default function HomeScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();

  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  const [incomeFields, setIncomeFields] =
    useState<string[]>(defaultIncomeFields);

  const [expenseFields, setExpenseFields] =
    useState<string[]>(defaultExpenseFields);

  const [investmentFields, setInvestmentFields] = useState<string[]>(
    defaultInvestmentFields,
  );

  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isIncomeFieldsModalVisible, setIsIncomeFieldsModalVisible] =
    useState(false);

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isExpenseFieldsModalVisible, setIsExpenseFieldsModalVisible] =
    useState(false);

  const [isInvestmentModalVisible, setIsInvestmentModalVisible] =
    useState(false);
  const [isInvestmentFieldsModalVisible, setIsInvestmentFieldsModalVisible] =
    useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem(
          TRANSACTIONS_STORAGE_KEY,
        );

        if (storedTransactions) {
          const parsedTransactions = JSON.parse(
            storedTransactions,
          ) as Transaction[];

          if (Array.isArray(parsedTransactions)) {
            setTransactions(parsedTransactions);
          }
        }
      } catch (error) {
        console.log("Transactions could not be loaded:", error);
      } finally {
        setIsStorageLoaded(true);
      }
    };

    loadTransactions();
  }, []);

  useEffect(() => {
    if (!isStorageLoaded) return;

    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem(
          TRANSACTIONS_STORAGE_KEY,
          JSON.stringify(transactions),
        );
      } catch (error) {
        console.log("Transactions could not be saved:", error);
      }
    };

    saveTransactions();
  }, [transactions, isStorageLoaded]);

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

  const currentMonthTransactions = useMemo(() => {
    const currentMonthKey = getCurrentMonthKey();

    return transactions.filter((item) => {
      return getTransactionMonthKey(item.date) === currentMonthKey;
    });
  }, [transactions]);

  const monthlyIncomeData = useMemo<MonthlyIncomeSummary[]>(() => {
    const groupedIncome = transactions
      .filter((item) => item.type === "income")
      .reduce<Record<string, MonthlyIncomeSummary>>((acc, item) => {
        const monthKey = getTransactionMonthKey(item.date);

        if (!monthKey) {
          return acc;
        }

        if (!acc[monthKey]) {
          acc[monthKey] = {
            monthKey,
            monthLabel: getMonthLabel(monthKey),
            totalIncome: 0,
            transactionCount: 0,
          };
        }

        acc[monthKey].totalIncome += item.amount;
        acc[monthKey].transactionCount += 1;

        return acc;
      }, {});

    return Object.values(groupedIncome).sort((a, b) =>
      b.monthKey.localeCompare(a.monthKey),
    );
  }, [transactions]);

  const handleSaveIncome = (transaction: Transaction) => {
    setTransactions((currentTransactions) => [
      transaction,
      ...currentTransactions,
    ]);
  };

  const handleSaveExpense = (newTransactions: Transaction[]) => {
    setTransactions((currentTransactions) => [
      ...newTransactions,
      ...currentTransactions,
    ]);
  };

  const handleSaveInvestment = (transaction: Transaction) => {
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

  const handleAddExpenseField = (fieldName: string) => {
    setExpenseFields((currentFields) => {
      const isAlreadyExists = currentFields.some(
        (field) => field.toLowerCase() === fieldName.toLowerCase(),
      );

      if (isAlreadyExists) {
        return currentFields;
      }

      return [...currentFields, fieldName];
    });
  };

  const handleDeleteExpenseField = (fieldName: string) => {
    setExpenseFields((currentFields) =>
      currentFields.filter((field) => field !== fieldName),
    );
  };

  const handleAddInvestmentField = (fieldName: string) => {
    setInvestmentFields((currentFields) => {
      const isAlreadyExists = currentFields.some(
        (field) => field.toLowerCase() === fieldName.toLowerCase(),
      );

      if (isAlreadyExists) {
        return currentFields;
      }

      return [...currentFields, fieldName];
    });
  };

  const handleDeleteInvestmentField = (fieldName: string) => {
    setInvestmentFields((currentFields) =>
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
            onPress={() => setIsExpenseModalVisible(true)}
          />

          <ActionButton
            title="Yatırım"
            icon="business"
            color={colors.investment}
            iconBackgroundColor={colors.investmentSoft}
            borderColor={colors.investmentBorder}
            onPress={() => setIsInvestmentModalVisible(true)}
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

          {currentMonthTransactions.map((item) => (
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

      <ExpenseTransactionModal
        visible={isExpenseModalVisible}
        expenseFields={expenseFields}
        onClose={() => setIsExpenseModalVisible(false)}
        onOpenFieldsModal={() => setIsExpenseFieldsModalVisible(true)}
        onSave={handleSaveExpense}
      />

      <ExpenseFieldsModal
        visible={isExpenseFieldsModalVisible}
        fields={expenseFields}
        onClose={() => setIsExpenseFieldsModalVisible(false)}
        onAddField={handleAddExpenseField}
        onDeleteField={handleDeleteExpenseField}
      />

      <InvestmentTransactionModal
        visible={isInvestmentModalVisible}
        investmentFields={investmentFields}
        onClose={() => setIsInvestmentModalVisible(false)}
        onOpenFieldsModal={() => setIsInvestmentFieldsModalVisible(true)}
        onSave={handleSaveInvestment}
      />

      <InvestmentFieldsModal
        visible={isInvestmentFieldsModalVisible}
        fields={investmentFields}
        onClose={() => setIsInvestmentFieldsModalVisible(false)}
        onAddField={handleAddInvestmentField}
        onDeleteField={handleDeleteInvestmentField}
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
  monthlyIncomeRow: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthlyIncomeMonth: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
  monthlyIncomeCount: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  monthlyIncomeAmount: {
    color: colors.income,
    fontSize: 15,
    fontWeight: "900",
  },
});
