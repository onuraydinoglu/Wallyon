import { Transaction } from "../types/transaction";

export const transactions: Transaction[] = [
  {
    id: 1,
    title: "Maaş",
    category: "Gelir",
    amount: 24560,
    type: "income",
    date: "31 Mayıs 2026",
  },
  {
    id: 2,
    title: "Market",
    category: "Gider",
    amount: 1250,
    type: "expense",
    date: "30 Mayıs 2026",
  },
  {
    id: 3,
    title: "Kira",
    category: "Gider",
    amount: 12000,
    type: "expense",
    date: "29 Mayıs 2026",
  },
  {
    id: 4,
    title: "Birikim",
    category: "Yatırım",
    amount: 3000,
    type: "investment",
    date: "28 Mayıs 2026",
  },
];
