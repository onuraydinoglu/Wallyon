import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../constants/theme";
import { transactions as initialTransactions } from "../../data/transactions";
import { Transaction } from "../../types/transaction";
import { formatCurrency } from "../../utils/formatCurrency";

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

const getMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split("-");
  const monthLabel = monthLabels[month] || "Bilinmeyen Ay";

  return `${monthLabel} ${year}`;
};

export default function AnalyticsScreen() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  useFocusEffect(
    useCallback(() => {
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
              return;
            }
          }

          setTransactions(initialTransactions);
        } catch (error) {
          console.log("Analytics transactions could not be loaded:", error);
          setTransactions(initialTransactions);
        }
      };

      loadTransactions();
    }, []),
  );

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

  const totalIncome = monthlyIncomeData.reduce(
    (total, item) => total + item.totalIncome,
    0,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerDescription}>
            Gelirlerini aylara göre takip et.
          </Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Toplam Gelir</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalIncome)}</Text>
        </View>

        <View style={styles.transactionsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aylık Gelir Tablosu</Text>

            <Text style={styles.seeAllText}>Ay Ay</Text>
          </View>

          {monthlyIncomeData.map((item) => (
            <View key={item.monthKey} style={styles.monthlyIncomeRow}>
              <View>
                <Text style={styles.monthlyIncomeMonth}>{item.monthLabel}</Text>

                <Text style={styles.monthlyIncomeCount}>
                  {item.transactionCount} gelir işlemi
                </Text>
              </View>

              <Text style={styles.monthlyIncomeAmount}>
                {formatCurrency(item.totalIncome)}
              </Text>
            </View>
          ))}

          {monthlyIncomeData.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>Gelir bulunamadı</Text>

              <Text style={styles.emptyStateText}>
                Gelir eklediğinde aylık gelir tablosu burada görünecek.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  header: {
    paddingTop: 8,
    paddingBottom: 22,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "900",
  },
  headerDescription: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
  totalCard: {
    borderRadius: 30,
    backgroundColor: colors.panel,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  totalLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
  },
  totalAmount: {
    marginTop: 8,
    color: colors.income,
    fontSize: 28,
    fontWeight: "900",
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
